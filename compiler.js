/**
 * Blueprint to C Compiler
 * 将可视化图形程序编译为 C 语言代码
 * 
 * 输入：Var（变量数组）、cardLinklist（卡片数组）、links（连线数组）
 * 输出：C 语言源代码字符串
 */

function compileToC(Var, cardLinklist, links) {
    let cCode = '';
    let indentLevel = 0;
    const indent = () => '    '.repeat(indentLevel);

    // 用于追踪已生成的 label，避免重复
    const generatedLabels = new Set();

    // ========== 辅助函数 ==========

    /**
     * 根据节点ID找到连接到该节点的源节点
     * @param {string} targetNodeId - 目标节点ID (如 "card1-node2")
     * @returns {object|null} - 源节点信息
     */
    function findSourceForNode(targetNodeId) {
        for (const link of links) {
            if (link.target && link.target.node === targetNodeId) {
                return link.source;
            }
        }
        return null;
    }

    /**
     * 根据节点ID找到该节点连接到的目标节点
     * @param {string} sourceNodeId - 源节点ID
     * @returns {object|null} - 目标节点信息
     */
    function findTargetForNode(sourceNodeId) {
        for (const link of links) {
            if (link.source && link.source.node === sourceNodeId) {
                return link.target;
            }
        }
        return null;
    }

    /**
     * 根据节点ID获取卡片和节点信息
     * @param {string} nodeId - 节点ID (如 "card1-node2")
     * @returns {object} - { card, node, nodeIndex }
     */
    function getCardAndNode(nodeId) {
        const parts = nodeId.split('-node');
        const cardId = parts[0];
        const nodeIndex = parseInt(parts[1]) - 1;
        const card = cardLinklist.find(c => c.id === cardId);
        if (!card) return { card: null, node: null, nodeIndex: -1 };
        const node = card.nodes[nodeIndex];
        return { card, node, nodeIndex };
    }

    /**
     * 获取某个卡片特定enumType的输入值
     * @param {object} card - 卡片对象
     * @param {string} enumType - 节点的enumType
     * @returns {string} - 值的表达式
     */
    function getInputValue(card, enumType) {
        // 找到该卡片上对应enumType的out节点
        for (let i = 0; i < card.nodes.length; i++) {
            const node = card.nodes[i];
            if (node.type === 'out' && node.enumType === enumType) {
                const nodeId = `${card.id}-node${i + 1}`;
                const target = findTargetForNode(nodeId);
                if (target) {
                    const { card: targetCard } = getCardAndNode(target.node);
                    if (targetCard) {
                        return resolveCardValue(targetCard);
                    }
                }
                // 如果有输入框的值
                if (node.value !== undefined && node.value !== '') {
                    return node.value;
                }
            }
        }
        return '0'; // 默认值
    }

    /**
     * 解析卡片的值（用于获取变量名、常数等）
     * @param {object} card - 卡片对象
     * @returns {string} - 值表达式
     */
    function resolveCardValue(card) {
        switch (card.type) {
            case '变量':
                // 查找连接到该变量卡片的Var
                // 通常变量卡片需要从输入或label获取变量名
                if (card.label && card.label !== '变量') {
                    return card.label;
                }
                // 尝试从节点的value获取
                for (const node of card.nodes) {
                    if (node.value && node.value !== '') {
                        // 查找Var数组中是否有这个变量
                        const varObj = Var.find(v => v.name === node.value);
                        if (varObj) return varObj.name;
                        return node.value;
                    }
                }
                return 'var_unknown';

            case '常数':
                // 常数卡片，获取输入的值
                for (const node of card.nodes) {
                    if (node.slot === 'input' && node.value !== undefined) {
                        return node.value;
                    }
                    if (node.value !== undefined && node.value !== '') {
                        return node.value;
                    }
                }
                return '0';

            case '+':
                return '+';
            case '-':
                return '-';
            case '*':
                return '*';
            case '/':
                return '/';
            case '%':
                return '%';
            case '&&':
                return '&&';
            case '||':
                return '||';
            case '==':
                return '==';
            case '!=':
                return '!=';
            case '>':
                return '>';
            case '<':
                return '<';
            case '>=':
                return '>=';
            case '<=':
                return '<=';

            case 'label':
                // 获取label名称
                for (const node of card.nodes) {
                    if (node.value && node.value !== '') {
                        return node.value;
                    }
                }
                return `label_${card.id}`;

            default:
                return card.label || card.type;
        }
    }

    /**
     * 获取运算符
     * @param {object} card - 运算卡片
     * @returns {string} - 运算符
     */
    function getOperator(card) {
        // 找到"运算种类"节点连接的目标
        for (let i = 0; i < card.nodes.length; i++) {
            const node = card.nodes[i];
            if (node.enumType === '运算种类' && node.type === 'out') {
                const nodeId = `${card.id}-node${i + 1}`;
                const target = findTargetForNode(nodeId);
                if (target) {
                    const { card: opCard } = getCardAndNode(target.node);
                    if (opCard) {
                        return opCard.type; // '+', '-', '*', '/', '%', '&&', '||'
                    }
                }
            }
        }
        return '+'; // 默认加法
    }

    /**
     * 获取连接到某个out节点的变量/值
     * @param {object} card - 卡片
     * @param {string} label - 节点的label
     * @returns {string} - 变量名或值
     */
    function getConnectedValue(card, label) {
        for (let i = 0; i < card.nodes.length; i++) {
            const node = card.nodes[i];
            if (node.type === 'out' && node.label === label) {
                const nodeId = `${card.id}-node${i + 1}`;
                const target = findTargetForNode(nodeId);
                if (target) {
                    const { card: connectedCard } = getCardAndNode(target.node);
                    if (connectedCard) {
                        return resolveCardValue(connectedCard);
                    }
                }
                // 检查节点自身是否有输入值
                if (node.value !== undefined && node.value !== '') {
                    return node.value;
                }
            }
        }
        return '0';
    }

    /**
     * 获取条件表达式
     * @param {object} card - 判断卡片
     * @returns {string} - 条件表达式
     */
    function getCondition(card) {
        const state = card.state || '相等';
        const varValue = getConnectedValue(card, '变量');
        const condValue = getConnectedValue(card, '条件');

        let op = '==';
        switch (state) {
            case '相等': op = '=='; break;
            case '大于': op = '>'; break;
            case '小于': op = '<'; break;
        }

        return `${varValue} ${op} ${condValue}`;
    }

    // ========== 拓扑排序 ==========

    function topologicalSortForCompile() {
        const inDegree = {};
        const graph = {};
        const callLinks = links.filter(l => l.source.enumType === 'call');

        // 初始化
        cardLinklist.forEach(card => {
            inDegree[card.id] = 0;
            graph[card.id] = [];
        });

        // 只考虑 call 类型的连接来确定执行顺序
        callLinks.forEach(link => {
            const sourceCardId = link.source.node.split('-')[0];
            const targetCardId = link.target.node.split('-')[0];

            if (sourceCardId !== targetCardId) {
                if (!graph[sourceCardId].includes(targetCardId)) {
                    graph[sourceCardId].push(targetCardId);
                    inDegree[targetCardId]++;
                }
            }
        });

        // BFS
        const queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);
        const sorted = [];

        while (queue.length > 0) {
            const cardId = queue.shift();
            sorted.push(cardId);

            graph[cardId].forEach(neighbor => {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            });
        }

        return sorted;
    }

    // ========== 代码生成 ==========

    // 1. 生成头文件
    cCode += '#include <stdio.h>\n';
    cCode += '#include <stdlib.h>\n';
    cCode += '#include <iostream>\n';
    cCode += 'using namespace std;\n';
    cCode += '\n';

    // 2. 生成全局变量声明
    cCode += '// 变量声明\n';
    Var.forEach(v => {
        if (v.name && v.name !== 'NULL' && v.name !== '') {
            const cType = mapTypeToCType(v.type);
            const initValue = v.value !== undefined && v.value !== '' ? v.value : '0';
            cCode += `${cType} ${v.name} = ${initValue};\n`;
        }
    });
    cCode += '\n';

    // 3. 生成主函数
    cCode += 'int main() {\n';
    indentLevel = 1;

    // 4. 按拓扑排序遍历卡片生成代码
    // 确保生成 Start 注释的状态变量已初始化
    let startGenerated = false;
    const sortedCardIds = topologicalSortForCompile();

    sortedCardIds.forEach(cardId => {
        const card = cardLinklist.find(c => c.id === cardId);
        if (!card) return;

        const code = generateCardCode(card);
        if (code) {
            cCode += code;
        }
    });

    // 5. 结束主函数
    cCode += indent() + 'return 0;\n';
    indentLevel = 0;
    cCode += '}\n';

    /**
     * 将类型映射为C类型
     */
    function mapTypeToCType(type) {
        const typeMap = {
            'int': 'int',
            'float': 'float',
            'double': 'double',
            'char': 'char',
            'string': 'char*',
            '整数': 'int',
            '浮点': 'double',
            '字符': 'char'
        };
        return typeMap[type] || 'int';
    }

    /**
     * 根据卡片类型生成对应的C代码
     */
    function generateCardCode(card) {
        let code = '';

        switch (card.type) {
            case 'start':
                // 起始节点只生成一次注释
                if (!startGenerated) {
                    startGenerated = true;
                    code += indent() + '// === 程序开始 ===\n';
                }
                break;

            case '赋值':
                {
                    const varA = getConnectedValue(card, 'A');
                    const varB = getConnectedValue(card, 'B');
                    code += indent() + `${varA} = ${varB};\n`;
                }
                break;

            case '运算':
                {
                    const op = getOperator(card);
                    const varA = getConnectedValue(card, 'A');
                    const varB = getConnectedValue(card, 'B');
                    const varC = getConnectedValue(card, 'C');
                    code += indent() + `${varC} = ${varA} ${op} ${varB};\n`;
                }
                break;

            case '输入':
                {
                    const targetVar = getConnectedValue(card, '目标变量');
                    // C++风格输入，忽略格式字符串
                    code += indent() + `std::cin >> ${targetVar};\n`;
                }
                break;

            case '打印':
                {
                    // 改为C++的 cout 风格输出
                    let printValue = '0';
                    // 优先查找out类型double节点连接的目标
                    for (let i = 0; i < card.nodes.length; i++) {
                        const node = card.nodes[i];
                        if (node.type === 'out' && node.enumType === 'double') {
                            const nodeId = `${card.id}-node${i + 1}`;
                            const target = findTargetForNode(nodeId);
                            if (target) {
                                const { card: targetCard } = getCardAndNode(target.node);
                                if (targetCard) {
                                    printValue = resolveCardValue(targetCard);
                                }
                            }
                        }
                    }
                    // 如果没有连接，检查节点自身的值
                    for (const node of card.nodes) {
                        if (node.value !== undefined && node.value !== '') {
                            printValue = node.value;
                            break;
                        }
                    }
                    // 生成C++风格的cout语句（注意：实际生成C代码时建议还是用printf，这里仅做演示）
                    code += indent() + `std::cout << ${printValue} << std::endl;\n`;
                }
                break;

            case '判断':
            case '循环判断':
                {
                    const condition = getCondition(card);
                    const labelName = getConnectedValue(card, 'label');

                    if (card.type === '循环判断') {
                        code += indent() + `if (${condition}) {\n`;
                        indentLevel++;
                        code += indent() + `goto ${labelName};\n`;
                        indentLevel--;
                        code += indent() + `}\n`;
                    } else {
                        code += indent() + `if (${condition}) {\n`;
                        indentLevel++;
                        code += indent() + `// 条件为真时的代码\n`;
                        indentLevel--;
                        code += indent() + `}\n`;
                    }
                }
                break;

            case '跳转':
                {
                    const labelName = getConnectedValue(card, 'label');
                    //code += indent() + `goto ${labelName};\n`;
                }
                break;

            case '条件跳转':
                {
                    const left = getConnectedValue(card, '左值');
                    const comp = getConnectedValue(card, '比较符');
                    const right = getConnectedValue(card, '右值');
                    const trueLabel = getConnectedValue(card, '真分支');
                    const falseLabel = getConnectedValue(card, '假分支');
                    if (trueLabel == 0) {
                        code += indent() + `if (${left} ${comp} ${right}) {} else { goto ${falseLabel}; }\n`;
                    } else if (falseLabel == 0) {
                        code += indent() + `if (${left} ${comp} ${right}) { goto ${trueLabel}; } else {};\n`;
                    } else {
                        code += indent() + `if (${left} ${comp} ${right}) { goto ${trueLabel}; } else { goto ${falseLabel}; }\n`;
                    }
                }
                break;

            case '自增':
                {
                    const varName = getConnectedValue(card, '变量');
                    code += indent() + `${varName}++;\n`;
                }
                break;

            case '自减':
                {
                    const varName = getConnectedValue(card, '变量');
                    code += indent() + `${varName}--;\n`;
                }
                break;

            case '返回':
                {
                    const retVal = getConnectedValue(card, '返回值');
                    code += indent() + `return ${retVal};\n`;
                }
                break;
            /*TODO: 未完成部分*/
            case 'if':
                {
                    //const condition = getConnectedValue(card, '条件');
                    //const thenLabel = getConnectedValue(card, 'then');
                    //const elseLabel = getConnectedValue(card, 'else');
                    //code += indent() + `if (${condition}) { goto ${thenLabel}; } else { goto ${elseLabel}; }\n`;
                    const A = getConnectedValue(card, 'A');
                    const B = getConnectedValue(card, 'B');
                    const comp = getConnectedValue(card, '比较符');
                    
                    code += indent() + `if (${A} ${comp} ${B}) {\n`;
                }
                break;
            case 'if_end':
                {
                    code += indent() + `}\n`;
                }
                break;
            case 'else':
                {
                    code += indent() + `else {\n`;
                }
                break;
            case 'else_end':
                {
                    code += indent() + `}\n`;
                }
                break;
            case 'while':
                {
                    /*
                    const whileCondition = getConnectedValue(card, '条件');
                    const bodyLabel = getConnectedValue(card, '循环体');
                    const exitLabel = getConnectedValue(card, '退出');
                    code += indent() + `while (${whileCondition}) { goto ${bodyLabel}; }\n`;
                    code += indent() + `goto ${exitLabel};\n`;
                    */
                    const A = getConnectedValue(card, 'A');
                    const B = getConnectedValue(card, 'B');
                    const comp = getConnectedValue(card, '比较符');
                    code += indent() + `while (${A} ${comp} ${B}) {\n`;
                }
                break;
            case 'while_end':
                {
                    code += indent() + `}\n`;
                }
                break;
            case 'for':
                {
                    /*
                    const initVal = getConnectedValue(card, '初值');
                    const forCondition = getConnectedValue(card, '条件');
                    const stepVal = getConnectedValue(card, '递增');
                    const forBodyLabel = getConnectedValue(card, '循环体');
                    const forExitLabel = getConnectedValue(card, '退出');
                    code += indent() + `for (${initVal}; ${forCondition}; ${stepVal}) { goto ${forBodyLabel}; }\n`;
                    code += indent() + `goto ${forExitLabel};\n`;*/
                    const initVal = getConnectedValue(card, '变量');
                    const delta = getConnectedValue(card, '步增');
                    const limit = getConnectedValue(card, '截至');
                    console.log('initVal:', initVal, 'delta:', delta, 'limit:', limit);
                    if (delta.startsWith('-')) {
                        code += indent() + `for (; ${initVal} >= ${limit}; ${initVal} += ${delta}) {\n`;
                    }else{
                        code += indent() + `for (; ${initVal} <= ${limit}; ${initVal} += ${delta}) {\n`;
                    }
                }
                break;
            case 'for_end':
                {
                    code += indent() + `}\n`;
                }
                break;
            case 'label':
                {
                    let labelName = 'label_' + card.id;
                    for (const node of card.nodes) {
                        if (node.value && node.value !== '') {
                            labelName = node.value;
                            break;
                        }
                    }
                    // 只有当该 label 还没生成过时才生成
                    if (!generatedLabels.has(labelName)) {
                        generatedLabels.add(labelName);
                        // label 需要在行首，不缩进
                        code += `${labelName}:\n`;
                    }
                }
                break;

            case '变量':
            case '常数':
            case '+':
            case '-':
            case '*':
            case '/':
            case '指针':
            case '>':
            case '<':
            case '>=':
            case '<=':
            case '==':
            case '!=':
            case '&&':
            case '||':    
                // 这些是数据节点，不直接生成执行语句
                // 它们的值在被其他节点引用时获取
                break;

            default:
                code += indent() + `// TODO: 未处理的卡片类型 "${card.type}"\n`;
                break;
        }

        return code;
    }

    return cCode;
}

/**
 * 编译并下载C代码
 */
function compileAndDownload() {
    try {
        const cCode = compileToC(Var, cardLinklist, links);
        console.log('=== 编译成功 ===');
        console.log(cCode);
        downloadTextAsFile(cCode, 'output.cpp');
        alert('编译成功！已下载 output.cpp');
    } catch (error) {
        console.error('编译错误:', error);
        alert('编译错误: ' + error.message);
    }
}

/**
 * 编译并显示C代码（不下载）
 */
function compileAndShow() {
    try {
        const cCode = compileToC(Var, cardLinklist, links);
        console.log('=== 编译结果 ===');
        console.log(cCode);
        return cCode;
    } catch (error) {
        console.error('编译错误:', error);
        return '// 编译错误: ' + error.message;
    }
}

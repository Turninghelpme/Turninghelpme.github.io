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
            // 新增：访问数组卡片类型
            case '访问数组': {
                // "数组名"为 out 节点，"数组索引"为 out 节点
                const arrName = getConnectedValue(card, '数组名');
                const idx = getConnectedValue(card, '数组索引');
                return `${arrName}[${idx}]`;
            }
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

            case '取地址&':
                return '&' + getConnectedValue(card, '变量');
            case '解地址*':
                return '*' + getConnectedValue(card, '变量');

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
            let cType = mapTypeToCType(v.type);
            let initValue = v.value !== undefined && v.value !== '' ? v.value : '0';

            // 支持 type 为 int[10] 形式自动生成 int a[10] = {0};
            const arrayTypeMatch = /^(\w+)\s*\[(.+)\]$/.exec(v.type);
            if (arrayTypeMatch) {
                // v.type = int[10]，v.name = a
                const baseType = arrayTypeMatch[1];
                const arraySize = arrayTypeMatch[2];
                if (initValue === '0') initValue = '{0}';
                cCode += `${baseType} ${v.name}[${arraySize}] = ${initValue};\n`;
            } else if (v.name.includes('[') || (cType && cType.includes('['))) {
                if (initValue === '0') initValue = '{0}'; // 数组初始化
                if (v.name.includes('[')) {
                    // name="a[10]", type="int" -> int a[10] = {0};
                    cCode += `${cType} ${v.name} = ${initValue};\n`;
                } else {
                    // name="a", type="int[10]" -> int a[10] = {0};
                    const bracketIndex = cType.indexOf('[');
                    const baseType = cType.substring(0, bracketIndex).trim();
                    const arrayPart = cType.substring(bracketIndex).trim();
                    cCode += `${baseType} ${v.name}${arrayPart} = ${initValue};\n`;
                }
            } else {
                // 指针类型初始化优化
                if (cType && cType.includes('*') && initValue === '0') {
                    initValue = 'NULL';
                }
                cCode += `${cType} ${v.name} = ${initValue};\n`;
            }
        }
    });
    cCode += '\n';

    function buildCallGraph() {
        const g = {};
        const indeg = {};
        cardLinklist.forEach(c => {
            g[c.id] = [];
            indeg[c.id] = 0;
        });
        links.forEach(l => {
            if (l.source && l.source.enumType === 'call' && l.target) {
                const s = l.source.node.split('-')[0];
                const t = l.target.node.split('-')[0];
                if (s !== t && !g[s].includes(t)) {
                    g[s].push(t);
                    indeg[t]++;
                }
            }
        });
        return { g, indeg };
    }

    function collectReachable(rootId, g) {
        const visited = new Set();
        const q = [rootId];
        while (q.length) {
            const x = q.shift();
            if (visited.has(x)) continue;
            visited.add(x);
            const ns = g[x] || [];
            ns.forEach(n => {
                if (!visited.has(n)) q.push(n);
            });
        }
        return visited;
    }

    function topoSubset(orderSet, g) {
        const indeg = {};
        orderSet.forEach(id => {
            indeg[id] = 0;
        });
        orderSet.forEach(id => {
            (g[id] || []).forEach(n => {
                if (orderSet.has(n)) indeg[n]++;
            });
        });
        const q = [];
        orderSet.forEach(id => {
            if (indeg[id] === 0) q.push(id);
        });
        const out = [];
        while (q.length) {
            const x = q.shift();
            out.push(x);
            (g[x] || []).forEach(n => {
                if (!orderSet.has(n)) return;
                indeg[n]--;
                if (indeg[n] === 0) q.push(n);
            });
        }
        return out;
    }

    function findLabelNameInSet(idSet) {
        for (const id of idSet) {
            const c = cardLinklist.find(x => x.id === id);
            if (!c) continue;
            if (c.type === 'label') {
                for (const n of c.nodes) {
                    if (n.slot === 'input' && n.value && n.value !== '') {
                        return n.value;
                    }
                }
            }
        }
        return null;
    }

    function getCustomFunctionName(card) {
        if (!card) return 'func';
        const labelInput = getInputValue(card, 'label');
        if (labelInput && labelInput !== '0') return labelInput;
        if (card.label && card.label !== '自定义函数' && card.label !== '定义函数') return card.label;
        return 'func';
    }

    function getDefineFunctionName(card) {
        if (!card) return 'func';
        if (card.label && card.label !== '定义函数') return card.label;
        return 'func';
    }

    const { g } = buildCallGraph();
    const mainRoots = cardLinklist.filter(c => c.type === 'start').map(c => c.id);
    const mainReachable = new Set();
    mainRoots.forEach(r => {
        collectReachable(r, g).forEach(id => mainReachable.add(id));
    });
    const funcRoots = cardLinklist
        .filter(c => c.type === '定义函数' && !mainReachable.has(c.id))
        .map(c => c.id);
    const funcRootSet = new Set(funcRoots);

    function getFuncCallsInSet(idSet) {
        const calls = [];
        idSet.forEach(id => {
            const c = cardLinklist.find(x => x.id === id);
            if (!c) return;
            if (c.type === '自定义函数') {
                const fn = getCustomFunctionName(c);
                calls.push(fn);
            } else if (c.type === '定义函数' && !funcRootSet.has(c.id)) {
                const fn = getDefineFunctionName(c);
                calls.push(fn);
            }
        });
        return calls;
    }

    const funcDefs = funcRoots.map((rid, idx) => {
        const reachable = collectReachable(rid, g);
        const order = topoSubset(reachable, g);
        const rootCard = cardLinklist.find(c => c.id === rid);
        let name = null;
        if (rootCard && rootCard.label && rootCard.label !== '定义函数') {
            name = rootCard.label;
        }
        if (!name) {
            name = findLabelNameInSet(reachable) || `func_${idx + 1}`;
        }
        const deps = getFuncCallsInSet(reachable);
        const params = [];
        function getVarTypeFromCards(varName) {
            for (const c of cardLinklist) {
                if (!c || c.type !== '变量') continue;
                let nameValue = null;
                let typeValue = null;
                if (Array.isArray(c.nodes)) {
                    for (const node of c.nodes) {
                        if (node.slot === 'input' && node.value) {
                            nameValue = node.value;
                        }
                        if (node.slot === 'type' && node.value) {
                            typeValue = node.value;
                        }
                    }
                }
                if (!nameValue && c.label && c.label !== '变量') {
                    nameValue = c.label;
                }
                if (nameValue === varName && typeValue) {
                    return typeValue;
                }
            }
            return null;
        }
        if (rootCard && Array.isArray(rootCard.nodes)) {
            for (let i = 0; i < rootCard.nodes.length; i++) {
                const n = rootCard.nodes[i];
                if (n && n.type === 'out' && n.enumType !== 'call') {
                    const pname = n.label && n.label !== '' ? n.label : `p${n.level || (i + 1)}`;
                    let ptype = 'int';
                    if (n.slot === 'type' && n.value) {
                        ptype = mapTypeToCType(n.value);
                    } else {
                        const slotType = getVarTypeFromCards(pname);
                        if (slotType) {
                            ptype = mapTypeToCType(slotType);
                        } else {
                            const varObj = Var.find(v => v.name === pname);
                            if (varObj && varObj.type) {
                                ptype = mapTypeToCType(varObj.type);
                            } else if (n.enumType) {
                                ptype = mapTypeToCType(n.enumType);
                            }
                        }
                    }
                    params.push({ name: pname, type: ptype });
                }
            }
        }
        return { rid, name, order, deps, params };
    });

    const nameToDef = new Map(funcDefs.map(fd => [fd.name, fd]));
    const depGraph = {};
    const indegDep = {};
    funcDefs.forEach(fd => {
        depGraph[fd.name] = [];
        indegDep[fd.name] = 0;
    });
    funcDefs.forEach(fd => {
        fd.deps.forEach(dn => {
            if (nameToDef.has(dn) && dn !== fd.name && !depGraph[fd.name].includes(dn)) {
                depGraph[fd.name].push(dn);
                indegDep[dn]++;
            }
        });
    });
    const depQueue = Object.keys(indegDep).filter(n => indegDep[n] === 0);
    const funcOrder = [];
    while (depQueue.length) {
        const x = depQueue.shift();
        funcOrder.push(x);
        (depGraph[x] || []).forEach(n => {
            indegDep[n]--;
            if (indegDep[n] === 0) depQueue.push(n);
        });
    }

    let isCompilingFunction = false;
    let currentFnName = null;
    funcOrder.forEach(n => {
        const fd = nameToDef.get(n);
        if (!fd) return;
        const paramSig = (fd.params && fd.params.length) ? fd.params.map(p => `${p.type} ${p.name}`).join(', ') : '';
        cCode += `void ${fd.name}(${paramSig}) {\n`;
        indentLevel = 1;
        let startGenerated = false;
        isCompilingFunction = true;
        currentFnName = fd.name;
        fd.order.forEach(cid => {
            if (cid === fd.rid) return;
            const card = cardLinklist.find(c => c.id === cid);
            if (!card) return;
            const code = generateCardCode(card);
            if (code) cCode += code;
        });
        cCode += '}\n\n';
        indentLevel = 0;
        isCompilingFunction = false;
        currentFnName = null;
    });

    cCode += 'int main() {\n';
    indentLevel = 1;
    let startGenerated = false;
    const mainSet = new Set();
    mainRoots.forEach(r => {
        collectReachable(r, g).forEach(id => mainSet.add(id));
    });
    let mainOrder = topoSubset(mainSet, g);
    if (mainOrder.length === 0) {
        const allOrder = topologicalSortForCompile();
        const funcUnion = new Set();
        funcRoots.forEach(r => collectReachable(r, g).forEach(id => funcUnion.add(id)));
        mainOrder = allOrder.filter(id => !funcUnion.has(id));
    }
    mainOrder.forEach(cardId => {
        const card = cardLinklist.find(c => c.id === cardId);
        if (!card) return;
        const code = generateCardCode(card);
        if (code) cCode += code;
    });
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
        // 如果类型已经在映射表中，直接返回
        if (typeMap[type]) return typeMap[type];

        // 如果包含 * (指针) 或 [ (数组)，直接返回原类型
        if (type && (type.includes('*') || type.includes('['))) {
            return type;
        }

        return 'int';
    }

    /**
     * 根据卡片类型生成对应的C代码
     */
    function generateCardCode(card) {
        let code = '';

        switch (card.type) {
            case 'start':
                if (!isCompilingFunction) {
                    if (!startGenerated) {
                        startGenerated = true;
                        code += indent() + '// === 程序开始 ===\n';
                    }
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
                    } else {
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
            case '定义函数':
                // 如果当前正在编译某个函数定义，且遇到的卡片正是该函数的定义卡片，则跳过（避免递归生成）
                // 注意：funcOrder 遍历时已经排除了 rootCard，所以这里通常不会遇到正在编译的 rootCard
                // 除非是有递归调用或者多重定义
                // 这里的处理逻辑应当视为“函数调用”
                {
                    const fnName = getDefineFunctionName(card);
                    // 避免递归调用的无限生成（简单防止）
                    if (isCompilingFunction && fnName === currentFnName) {
                        // 递归调用，允许生成
                    }

                    let args = [];
                    if (typeof nameToDef !== 'undefined') {
                        const fd = nameToDef.get(fnName);
                        if (fd && fd.params && fd.params.length) {
                            args = fd.params.map(p => {
                                // 尝试获取连接到对应参数label的值
                                const val = getConnectedValue(card, p.name);
                                if (val !== '0') return val;
                                return p.name; // 降级：如果没有连接，使用参数名
                            });
                        }
                    }
                    const argStr = args.join(', ');
                    code += indent() + `${fnName}(${argStr});\n`;
                }
                break;

            case '自定义函数':
                {
                    let fnName = getCustomFunctionName(card);
                    if (!fnName || fnName === '自定义函数' || fnName === '定义函数') {
                        if (isCompilingFunction && currentFnName) {
                            fnName = currentFnName;
                        } else {
                            fnName = 'func';
                        }
                    }
                    let args = [];
                    if (typeof nameToDef !== 'undefined') {
                        const fd = nameToDef.get(fnName);
                        if (fd && fd.params && fd.params.length) {
                            args = fd.params.map(p => {
                                // 尝试获取连接到对应参数label的值
                                const val = getConnectedValue(card, p.name);
                                if (val !== '0') return val;
                                return p.name; // 降级：如果没有连接，使用参数名
                            });
                        }
                    }
                    const argStr = args.join(', ');
                    code += indent() + `${fnName}(${argStr});\n`;
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
 * 编译并保存C代码到compiled_code文件夹
 */
async function compileAndDownload() {
    try {
        const cCode = compileToC(Var, cardLinklist, links);
        console.log('=== 编译成功 ===');
        console.log(cCode);
        
        const result = await downloadTextAsFile(cCode, 'output.cpp');
        
        if (result && result.success) {
            alert(`编译成功！C代码已保存到: ${result.path}`);
        } else {
            alert('编译成功！但保存文件时遇到问题。请检查控制台获取详细信息。');
        }
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

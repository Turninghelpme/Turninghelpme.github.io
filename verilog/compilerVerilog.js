/**
 * Verilog 编译器
 * 将可视化图形（Var, cardLinklist, links）编译成 Verilog HDL 代码
 * 
 * 生成基于状态机的 Verilog testbench 模块
 */

/**
 * 编译并下载 Verilog 文件
 */
function compileAndDownloadVerilog() {
    try {
        const verilogCode = compileToVerilog();
        downloadTextAsFile(verilogCode, 'blueprint_design.v');
        console.log('Verilog 代码已生成并下载');
    } catch (error) {
        console.error('编译错误:', error.message);
        alert('编译错误: ' + error.message);
    }
}

/**
 * 主编译函数：将图形编译为 Verilog 代码
 */
function compileToVerilog() {
    // 1. 收集所有寄存器变量
    const registers = collectRegisters();
    
    // 2. 构建执行顺序（按控制流）
    const executionOrder = buildExecutionOrder();
    
    // 3. 生成 Verilog 代码
    return generateVerilogCode(registers, executionOrder);
}

/**
 * 收集所有寄存器变量
 */
function collectRegisters() {
    const registers = new Map();
    
    // 从 Var 数组收集
    Var.forEach(v => {
        if (v.name && v.name !== 'NULL') {
            registers.set(v.name, {
                name: v.name,
                type: v.type || 'reg',
                initValue: v.value || 0,
                width: 32  // 默认 32 位
            });
        }
    });
    
    return registers;
}

/**
 * 构建执行顺序 - 按控制流遍历
 */
function buildExecutionOrder() {
    const order = [];
    const visited = new Set();
    
    // 找到起始卡片
    const startCard = cardLinklist.find(c => c.type === 'start');
    if (!startCard) {
        throw new Error('未找到起始卡片（Start）');
    }
    
    // 从起始卡片开始，按控制流遍历
    let currentCardId = startCard.id;
    
    while (currentCardId && !visited.has(currentCardId)) {
        visited.add(currentCardId);
        const card = cardLinklist.find(c => c.id === currentCardId);
        if (!card) break;
        
        order.push(card);
        
        // 找下一个控制流连接的卡片
        currentCardId = findNextCallCard(currentCardId);
    }
    
    return order;
}

/**
 * 查找通过 call 连接的下一个卡片
 */
function findNextCallCard(cardId) {
    // 找到从这个卡片的 call out 连出的链接
    for (const link of links) {
        const sourceCardId = link.source.node.split('-')[0];
        if (sourceCardId === cardId && link.source.enumType === 'call') {
            // 找到目标卡片
            const targetCardId = link.target.node.split('-')[0];
            return targetCardId;
        }
    }
    return null;
}

/**
 * 获取连接到某个卡片某个节点的源信息
 */
function getConnectedSource(cardId, nodeLabel) {
    const card = cardLinklist.find(c => c.id === cardId);
    if (!card) return null;
    
    // 找到对应 label 的节点索引
    const nodeIndex = card.nodes.findIndex(n => n.label === nodeLabel);
    if (nodeIndex === -1) return null;
    
    const targetNodeId = `${cardId}-node${nodeIndex + 1}`;
    
    // 找到连接到这个节点的链接
    for (const link of links) {
        if (link.target.node === targetNodeId) {
            const sourceCardId = link.source.node.split('-')[0];
            const sourceCard = cardLinklist.find(c => c.id === sourceCardId);
            if (sourceCard) {
                return { card: sourceCard, link: link };
            }
        }
    }
    return null;
}

/**
 * 获取变量或常数的值表达式
 */
function getValueExpression(cardId, nodeLabel) {
    const source = getConnectedSource(cardId, nodeLabel);
    if (!source) return null;
    
    const sourceCard = source.card;
    
    switch (sourceCard.type) {
        case '变量':
        case '寄存器':
            // 从输入框获取变量名
            const varNode = sourceCard.nodes.find(n => n.slot === 'input');
            if (varNode && varNode.value) {
                return varNode.value;
            }
            return null;
            
        case '常数':
            const constNode = sourceCard.nodes.find(n => n.slot === 'input');
            if (constNode && constNode.value !== undefined) {
                return constNode.value;
            }
            return '0';
            
        default:
            return null;
    }
}

/**
 * 获取运算类型
 */
function getOperationType(cardId) {
    const source = getConnectedSource(cardId, '运算种类');
    if (!source) return '+';
    
    const opCard = source.card;
    // 返回运算符类型
    return opCard.type || '+';
}

/**
 * 获取 label 名称
 */
function getLabelName(cardId, nodeLabel = 'label') {
    const source = getConnectedSource(cardId, nodeLabel);
    if (!source) return null;
    
    const labelCard = source.card;
    if (labelCard.type === 'label') {
        const labelNode = labelCard.nodes.find(n => n.slot === 'input');
        if (labelNode && labelNode.value) {
            return labelNode.value;
        }
    }
    return null;
}

/**
 * 获取条件类型
 */
function getConditionType(cardId) {
    const source = getConnectedSource(cardId, '条件');
    if (!source) return '相等';
    
    const condCard = source.card;
    return condCard.state || condCard.label || '相等';
}

/**
 * 生成 Verilog 代码
 */
function generateVerilogCode(registers, executionOrder) {
    let code = '';
    
    // 模块头
    code += '// ============================================\n';
    code += '// Verilog 代码 - 由 Blueprint 可视化编程工具生成\n';
    code += '// ============================================\n\n';
    code += '`timescale 1ns / 1ps\n\n';
    code += 'module blueprint_design;\n\n';
    
    // 声明寄存器
    code += '    // 寄存器声明\n';
    registers.forEach((reg, name) => {
        code += `    reg signed [31:0] ${name};\n`;
    });
    
    // 添加状态机相关寄存器
    code += '\n    // 状态机\n';
    code += '    reg [7:0] state;\n';
    code += '    reg done;\n';
    code += '\n';
    
    // 生成状态参数
    code += '    // 状态定义\n';
    const states = [];
    let stateIndex = 0;
    const cardToState = new Map();
    const labelToState = new Map();
    let startGenerated = false;
    const generatedLabels = new Set();
    
    for (const card of executionOrder) {
        if (card.type === 'start') continue;
        
        // 检查是否有 label 连接到这个卡片
        const labelName = findLabelForCard(card.id);
        if (labelName && !generatedLabels.has(labelName)) {
            const stateName = `STATE_${labelName.toUpperCase()}`;
            states.push({ name: stateName, index: stateIndex });
            labelToState.set(labelName, stateIndex);
            generatedLabels.add(labelName);
            stateIndex++;
        }
        
        const stateName = `STATE_${stateIndex}`;
        states.push({ name: stateName, index: stateIndex });
        cardToState.set(card.id, stateIndex);
        stateIndex++;
    }
    states.push({ name: 'STATE_DONE', index: stateIndex });
    
    for (const state of states) {
        code += `    parameter ${state.name} = 8'd${state.index};\n`;
    }
    code += '\n';
    
    // 初始化块
    code += '    // 初始化\n';
    code += '    initial begin\n';
    registers.forEach((reg, name) => {
        code += `        ${name} = ${reg.initValue};\n`;
    });
    code += '        state = 8\'d0;\n';
    code += '        done = 0;\n';
    code += '        #10;\n';
    code += '        run_program();\n';
    code += '    end\n\n';
    
    // 主任务
    code += '    // 主程序任务\n';
    code += '    task run_program;\n';
    code += '    begin\n';
    code += '        while (!done) begin\n';
    code += '            case (state)\n';
    
    // 为每个状态生成代码
    generatedLabels.clear();
    for (let i = 0; i < executionOrder.length; i++) {
        const card = executionOrder[i];
        if (card.type === 'start') {
            if (!startGenerated) {
                code += `                8'd0: begin\n`;
                code += `                    // 程序开始\n`;
                const nextState = i + 1 < executionOrder.length ? cardToState.get(executionOrder[i + 1].id) : stateIndex;
                code += `                    state = 8'd${nextState};\n`;
                code += `                end\n`;
                startGenerated = true;
            }
            continue;
        }
        
        const currentState = cardToState.get(card.id);
        const nextCard = i + 1 < executionOrder.length ? executionOrder[i + 1] : null;
        const nextState = nextCard ? cardToState.get(nextCard.id) : stateIndex;
        
        code += `                8'd${currentState}: begin\n`;
        
        switch (card.type) {
            case '赋值':
                const assignA = getValueExpression(card.id, 'A');
                const assignB = getValueExpression(card.id, 'B');
                if (assignA && assignB) {
                    code += `                    // 赋值: ${assignA} = ${assignB}\n`;
                    code += `                    ${assignA} = ${assignB};\n`;
                }
                code += `                    state = 8'd${nextState};\n`;
                break;
                
            case '运算':
                const opResult = getValueExpression(card.id, 'C');
                const opA = getValueExpression(card.id, 'A');
                const opB = getValueExpression(card.id, 'B');
                const opType = getOperationType(card.id);
                
                if (opResult && opA && opB) {
                    code += `                    // 运算: ${opResult} = ${opA} ${opType} ${opB}\n`;
                    code += `                    ${opResult} = ${opA} ${opType} ${opB};\n`;
                }
                code += `                    state = 8'd${nextState};\n`;
                break;
                
            case '打印':
                const printVal = getValueExpression(card.id, '打印值');
                if (printVal) {
                    code += `                    // $display\n`;
                    code += `                    $display("${printVal} = %d", ${printVal});\n`;
                } else {
                    code += `                    $display("output");\n`;
                }
                code += `                    state = 8'd${nextState};\n`;
                break;
                
            case '循环判断':
                const loopVar = getValueExpression(card.id, '寄存器') || getValueExpression(card.id, '变量');
                const labelName = getLabelName(card.id, 'label');
                const condType = getConditionType(card.id);
                
                let condOp = '==';
                if (condType === '大于') condOp = '>';
                else if (condType === '小于') condOp = '<';
                
                const jumpState = labelName && labelToState.has(labelName) 
                    ? labelToState.get(labelName) 
                    : nextState;
                
                if (loopVar) {
                    code += `                    // 循环判断\n`;
                    code += `                    if (${loopVar} ${condOp} 0)\n`;
                    code += `                        state = 8'd${jumpState};\n`;
                    code += `                    else\n`;
                    code += `                        state = 8'd${nextState};\n`;
                } else {
                    code += `                    state = 8'd${nextState};\n`;
                }
                break;
                
            case '跳转':
                const gotoLabel = getLabelName(card.id, 'label');
                if (gotoLabel && labelToState.has(gotoLabel)) {
                    const gotoState = labelToState.get(gotoLabel);
                    code += `                    // 跳转到 ${gotoLabel}\n`;
                    code += `                    state = 8'd${gotoState};\n`;
                } else {
                    code += `                    state = 8'd${nextState};\n`;
                }
                break;
                
            default:
                code += `                    // ${card.type}\n`;
                code += `                    state = 8'd${nextState};\n`;
        }
        
        code += `                end\n`;
    }
    
    // 完成状态
    code += `                8'd${stateIndex}: begin\n`;
    code += `                    // 程序结束\n`;
    code += `                    done = 1;\n`;
    code += `                    $display("=== 程序执行完成 ===");\n`;
    code += `                    $finish;\n`;
    code += `                end\n`;
    code += '                default: begin\n';
    code += '                    done = 1;\n';
    code += '                end\n';
    code += '            endcase\n';
    code += '            #1;\n';
    code += '        end\n';
    code += '    end\n';
    code += '    endtask\n\n';
    
    code += 'endmodule\n';
    
    return code;
}

/**
 * 查找连接到某个卡片的 label
 */
function findLabelForCard(cardId) {
    // 查找是否有 label 卡片通过跳转指向这个卡片
    for (const link of links) {
        if (link.source.enumType === 'label') {
            const sourceCardId = link.source.node.split('-')[0];
            const sourceCard = cardLinklist.find(c => c.id === sourceCardId);
            
            if (sourceCard && (sourceCard.type === '跳转' || sourceCard.type === '循环判断')) {
                // 检查这个跳转/循环的下一个执行卡片是否是目标卡片
                const nextCard = findNextCallCard(sourceCardId);
                if (nextCard === cardId) {
                    // 获取 label 名称
                    const targetCardId = link.target.node.split('-')[0];
                    const labelCard = cardLinklist.find(c => c.id === targetCardId);
                    if (labelCard && labelCard.type === 'label') {
                        const labelNode = labelCard.nodes.find(n => n.slot === 'input');
                        if (labelNode && labelNode.value) {
                            return labelNode.value;
                        }
                    }
                }
            }
        }
    }
    return null;
}

console.log('Verilog 编译器已加载');

//import stdCardKind from './lib/stdCard.json' assert { type: 'json' };

//将json变为对象
function getStdCardKind() {
    
    console.log("stdCardKind:", stdCardKind);
    return stdCardKind;
    
}
//变量内容

// 全局卡片类型数组
let cards = [];

function getCardKind() {
    fetch('./lib/stdCard.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('文件读取失败');
            }
            return response.json();
        })
        .then(data => {
            console.log('完整JSON数据:', data);

            // 获取 cardkind 数组
            cards = data.cardkind;
            console.log('卡片数量:', cards.length);

            // 过滤掉空对象
            const validCards = cards.filter(card =>
                card && Object.keys(card).length > 0
            );
            console.log('有效卡片:', validCards);
            
            // 更新全局 cards 为有效卡片
            cards = validCards;
            console.log('卡片类型已加载:', cards.length);
        })
        .catch(error => {
            console.error('错误:', error);
            // 加载失败时使用默认卡片
            cards = getDefaultCards();
            console.log('使用默认卡片配置');
        });
}

// 默认卡片配置（当JSON加载失败时使用）
function getDefaultCards() {
    return [
        { "id": "card0", "x": 0, "y": 0, "label": "Start", "type": "start", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "寄存器", "type": "寄存器", "nodes": [ { "type": "in", "level": 0, "enumType": "double", "label": "变量名", "color": "#fff", "multiConnected": -1, "slot": "input", "value": "" } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "常数", "type": "常数", "nodes": [ { "type": "in", "level": 0, "enumType": "double", "label": "数值", "color": "#fff", "multiConnected": 1, "slot": "input", "value": "" } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A = B", "type": "赋值", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "跳转", "type": "跳转", "nodes": [ { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "循环判断", "type": "循环判断", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "条件", "label": "条件", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "寄存器", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "label", "type": "label", "nodes": [ { "type": "in", "level": 0, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1, "slot": "input", "value": "" } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "wire", "type": "wire", "nodes": [ { "type": "in", "level": 0, "enumType": "wire", "label": "wire", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "运算", "type": "运算", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "运算种类", "label": "运算种类", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 4, "enumType": "double", "label": "C", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "$display", "type": "打印", "nodes": [ { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "打印值", "color": "#4fc3f7", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A+B", "type": "+", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A-B", "type": "-", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A*B", "type": "*", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A/B", "type": "/", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A&B", "type": "&", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A|B", "type": "|", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A^B", "type": "^", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A<<B", "type": "<<", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] },
        { "id": "card0", "x": 0, "y": 0, "label": "A>>B", "type": ">>", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#667eea", "#764ba2" ] }
    ];
}

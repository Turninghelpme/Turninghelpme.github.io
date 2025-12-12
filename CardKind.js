//import stdCardKind from './lib/stdCard.json' assert { type: 'json' };

//将json变为对象
function getStdCardKind() {
    
    console.log("stdCardKind:", stdCardKind);
    return stdCardKind;
    
}
//变量内容

stdio = {
    "cardkind":
    [
        { "id": "card0", "x": 0, "y": 0, "label": "Start", "type": "start", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "变量", "type": "变量", "nodes": [ { "type": "in", "level": 0, "enumType": "double", "label": "out", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "指针", "label": "指针", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f8" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "常数", "type": "常数", "nodes": [ { "type": "in", "level": 0, "enumType": "double", "label": "double", "color": "#fff","slot": "input", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "A = B", "type": "赋值", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f8" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "跳转", "type": "跳转", "nodes": [ { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "循环判断", "type": "循环判断", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "条件", "label": "条件", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "变量", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "label", "type": "label", "nodes": [ { "type": "in", "level": 0, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "指针", "type": "指针", "nodes": [ { "type": "in", "level": 0, "enumType": "指针", "label": "指针", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "运算", "type": "运算", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "运算种类", "label": "运算种类", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 4, "enumType": "double", "label": "C", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "打印", "type": "打印", "nodes": [ { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "in", "level": 1, "enumType": "double", "label": "double", "color": "#ffff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "A+B", "type": "+", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "A-B", "type": "-", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "A*B", "type": "*", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        ,
        { "id": "card0", "x": 0, "y": 0, "label": "A/B", "type": "/", "nodes": [ { "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 } ], "titleBarColor": [ "#84fab0", "#8fd3f4" ] }
        
    ]
};

function getCardKind_json_jsx(stdio)
{
    return JSON.parse(stdio);
}
function getCardKind() {
    fetch('./lib/StdCard.json')
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

            // 处理每个卡片
            validCards.forEach(card => {
                console.log(`卡片ID: ${card.id}, 类型: ${card.type}, 标签: ${card.label}`);
                console.log('节点数量:', card.nodes ? card.nodes.length : 0);
                console.log('标题栏颜色:', card.titleBarColor);
                console.log('---');
            });

            // 在页面上显示
            
            const output = document.getElementById('output');
            output.innerHTML = `
                    <h3>读取到 ${validCards.length} 个卡片配置</h3>
                    ${validCards.map(card => `
                        <div style="margin: 10px; padding: 10px; border: 1px solid #ccc;">
                            <strong>${card.label}</strong> (${card.type})<br>
                            ID: ${card.id}<br>
                            位置: (${card.x}, ${card.y})<br>
                            节点数: ${card.nodes.length}
                        </div>
                    `).join('')}
                `;
                
            
        })
        .catch(error => {
            console.error('错误:', error);
            document.getElementById('output').innerHTML =
                `<p style="color: red;">错误: ${error.message}</p>`;
        });
        
}


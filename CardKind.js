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
        { "id": "card0", "x": 0, "y": 0, "label": "Start", "type": "start", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "变量", "type": "变量", "nodes": [{ "type": "in", "level": 0, "enumType": "double", "label": "变量名", "color": "#fff", "multiConnected": 1, "slot": "input", "value": "" }], "titleBarColor": ["#8fd3f8", "#84fab0"] },
        { "id": "card0", "x": 0, "y": 0, "label": "常数", "type": "常数", "nodes": [{ "type": "in", "level": 0, "enumType": "double", "label": "数值", "color": "#fff", "multiConnected": 1, "slot": "input", "value": "" }], "titleBarColor": ["#ffd3a5", "#fd6585"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A = B", "type": "赋值", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f8"] },
        { "id": "card0", "x": 0, "y": 0, "label": "运算", "type": "运算", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "运算种类", "label": "运算种类", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "A", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "B", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 4, "enumType": "double", "label": "C", "color": "#ffff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "打印", "type": "打印", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "打印值", "color": "#4fc3f7", "multiConnected": 1 }], "titleBarColor": ["#42e695", "#3bb2b8"] },
        { "id": "card0", "x": 0, "y": 0, "label": "输入", "type": "输入", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "目标变量", "color": "#ffff", "multiConnected": 1 }], "titleBarColor": ["#f6d365", "#fda085"] },
        { "id": "card0", "x": 0, "y": 0, "label": "跳转", "type": "跳转", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#f83600", "#f9d423"] },
        { "id": "card0", "x": 0, "y": 0, "label": "条件跳转", "type": "条件跳转", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "左值", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "右值", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 4, "enumType": "label", "label": "真分支", "color": "#7bed9f", "multiConnected": 1 }, { "type": "out", "level": 5, "enumType": "label", "label": "假分支", "color": "#ff6b6b", "multiConnected": 1 }], "titleBarColor": ["#8ec5fc", "#e0c3fc"] },
        { "id": "card0", "x": 0, "y": 0, "label": "自增", "type": "自增", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "变量", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#74ebd5", "#acb6e5"] },
        { "id": "card0", "x": 0, "y": 0, "label": "自减", "type": "自减", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "变量", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fbc2eb", "#a6c1ee"] },
        { "id": "card0", "x": 0, "y": 0, "label": "返回", "type": "返回", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "返回值", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fda085", "#f6d365"] },
        { "id": "card0", "x": 0, "y": 0, "label": "label", "type": "label", "nodes": [{ "type": "in", "level": 0, "enumType": "label", "label": "label", "color": "#fff", "multiConnected": 1, "slot": "input", "value": "" }], "titleBarColor": ["#b2fefa", "#0ed2f7"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A+B", "type": "+", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A-B", "type": "-", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A*B", "type": "*", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A/B", "type": "/", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A%B", "type": "%", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A&&B", "type": "&&", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#a1c4fd", "#c2e9fb"] },
        { "id": "card0", "x": 0, "y": 0, "label": "A||B", "type": "||", "nodes": [{ "type": "in", "level": 0, "enumType": "运算种类", "label": "运算种类", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#a1c4fd", "#c2e9fb"] },
        { "id": "card0", "x": 0, "y": 0, "label": "==", "type": "==", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },
        { "id": "card0", "x": 0, "y": 0, "label": "!=", "type": "!=", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },
        { "id": "card0", "x": 0, "y": 0, "label": ">", "type": ">", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },
        { "id": "card0", "x": 0, "y": 0, "label": "<", "type": "<", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },
        { "id": "card0", "x": 0, "y": 0, "label": ">=", "type": ">=", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },
        { "id": "card0", "x": 0, "y": 0, "label": "<=", "type": "<=", "nodes": [{ "type": "in", "level": 0, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#fddb92", "#d1fdff"] },

        { "id": "card0", "x": 0, "y": 0, "label": "if", "type": "if", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "真", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "A", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "B", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "if_end", "type": "if_end", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },

        { "id": "card0", "x": 0, "y": 0, "label": "else", "type": "else", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "else_end", "type": "else_end", "nodes": [{ "type": "in", "level": 0, "enumType": "", label: "", color: "#fff" }], titleBarColor: ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "while", "type": "while", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "A", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "比较符", "label": "比较符", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "B", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "for", "type": "for", "nodes": [{ "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }, { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "变量", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "步增", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "截至", "color": "#fff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        //        { "id": "card0", "x": 0, "y": 0, "label": "while", "type": "while", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "条件", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "label", "label": "循环体", "color": "#7bed9f", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "label", "label": "退出", "color": "#ff6b6b", "multiConnected": 1 } ], "titleBarColor": [ "#f093fb", "#f5576c" ] },
        //        { "id": "card0", "x": 0, "y": 0, "label": "for", "type": "for", "nodes": [ { "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 1, "enumType": "double", "label": "初值", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 2, "enumType": "double", "label": "条件", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 3, "enumType": "double", "label": "递增", "color": "#fff", "multiConnected": 1 }, { "type": "out", "level": 4, "enumType": "label", "label": "循环体", "color": "#7bed9f", "multiConnected": 1 }, { "type": "out", "level": 5, "enumType": "label", "label": "退出", "color": "#ff6b6b", "multiConnected": 1 } ], "titleBarColor": [ "#4facfe", "#00f2fe" ] }
        { "id": "card0", "x": 0, "y": 0, "label": "while_end", "type": "while_end", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] },
        { "id": "card0", "x": 0, "y": 0, "label": "for_end", "type": "for_end", "nodes": [{ "type": "out", "level": 0, "enumType": "call", "label": "call", "color": "#fff", "multiConnected": 1 }, { "type": "in", "level": 0, "enumType": "call", "label": "call", "color": "#ffff", "multiConnected": 1 }], "titleBarColor": ["#84fab0", "#8fd3f4"] }

    ];
}


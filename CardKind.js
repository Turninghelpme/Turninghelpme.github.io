// nodekind.js

//card的定义·种类
function nodekind() {
    let cards = [{
        id: 'card0',
        x: 0,
        y: 0,
        label: 'Start',
        type: "start",
        nodes: [{
            type: "out",
            level: 0,
            enumType: 'call',
            color: '#fff',
            multiConnected: 1
        },],
        titleBarColor: ['#84fab0', '#8fd3f4']
    },
    {
        id: 'card1',
        x: 100,
        y: 200,
        label: '判断',
        type: "判断",
        states: '相等',
        nodes: [{
            type: "in",
            level: 0,
            enumType: 'call',
            color: '#fff'
        },
        {
            type: "in",
            level: 1,
            enumType: 'int',
            color: '#28C76F',
            slot: 'input',
            label: 'int',
            multiConnected: 1
        },
        {
            type: "in",
            level: 2,
            enumType: 'int',
            color: '#28C76F',
            slot: 'input',
            label: 'int',
            multiConnected: 1
        },
        {
            type: "out",
            level: 0,
            enumType: 'call',
            color: '#fff'
        },
        {
            type: "out",
            level: 1,
            enumType: 'bool',
            color: '#0396FF',
            label: 'bool',
            multiConnected: 1
        },
        ],
        titleBarColor: ['#fccb90', '#d57eeb']
    },
    {
        id: 'card2',
        x: 300,
        y: 400,
        label: 'BoolToString',
        type: "call",
        nodes: [{
            type: "in",
            level: 0,
            enumType: 'call',
            color: '#fff'
        },
        {
            type: "in",
            level: 1,
            enumType: 'bool',
            color: '#0396FF',
            label: 'bool',
            multiConnected: 1
        },
        {
            type: "out",
            level: 0,
            enumType: 'call',
            color: '#fff'
        },
        {
            type: "out",
            level: 1,
            enumType: 'string',
            color: '#DE4313',
            label: 'string',
            multiConnected: 1
        }
        ],
        titleBarColor: ['#3C8CE7', '#00EAFF']

    },
    {
        id: 'card3',
        x: 100,
        y: 300,
        label: '打印',
        type: "打印",
        nodes: [{
            type: "in",
            level: 0,
            enumType: 'call',
            color: '#fff'
        },
        {
            type: "in",
            level: 1,
            enumType: 'string',
            color: '#DE4313',
            label: 'string',
            multiConnected: 1
        }
        ],
        titleBarColor: ['#f6d365', '#fda085']
    },
    {
        id: 'card4',
        x: 50,
        y: 50,
        label: '加法',
        type: '加法',
        nodes:
            [
                {
                    type: "in",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                {
                    type: "out",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                { type: 'in', level: 1, enumType: 'int', label: 'A', color: '#fff', multiConnected: 1 },
                { type: 'in', level: 2, enumType: 'int', label: 'B', color: '#ffff', multiConnected: 1 },
                { type: 'out', level: 1, enumType: 'int', label: 'A+B', color: '#ff89', multiConnected: 1 }],
        titleBarColor: ['rgba(198, 46, 26, 0.9)', '#d3ff']
    }, {
        id: 'card5',
        x: 50,
        y: 50,
        label: '减法',
        type: '减法',
        nodes:
            [
                {
                    type: "in",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                {
                    type: "out",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                { type: 'in', level: 1, enumType: 'int', label: 'A', color: '#fff', multiConnected: 1 },
                { type: 'in', level: 2, enumType: 'int', label: 'B', color: '#ffff', multiConnected: 1 },
                { type: 'out', level: 1, enumType: 'int', label: 'A-B', color: '#ff89', multiConnected: 1 }],
        titleBarColor: ['rgba(32, 202, 32, 1)', '#d3ff']
    },{
        id: 'card6',
        x: 100,
        y: 200,
        label: '变量',
        type: "变量",
        nodes: [
        {
            type: "out",
            level: 0,
            enumType: 'num',
            color: '#0396FF',
            slot: 'input',
            label: 'bool',
            multiConnected: 1
        },
        ],
        titleBarColor: ['#81207bff', '#19b5dcff']
    },{
        id: 'card7',
        x: 50,
        y: 50,
        label: '赋值',
        type: '赋值',
        nodes:
            [
                {
                    type: "in",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                {
                    type: "out",
                    level: 0,
                    enumType: 'call',
                    color: '#fff'
                },
                { type: 'in', level: 1, enumType: 'num', label: 'A', color: '#fff', multiConnected: 1 },
                { type: 'in', level: 2, enumType: 'num', label: 'B', color: '#ffff', multiConnected: 1 },
                { type: 'out', level: 1, enumType: 'num', label: 'A=B', color: '#ff89', multiConnected: 1 }],
        titleBarColor: ['rgba(198, 46, 26, 0.9)', '#d3ff']
    },{
        id: 'card8',
        x: 8,
        y: 8,
        label: '常数',
        type: "常数",
        nodes: [{
            type: "out",
            level: 0,
            enumType: 'num',
            color: '#0396FF',
            slot: 'input',
            label: 'int',
            multiConnected: 1
        },],
        titleBarColor: ['#81207bff', '#19b5dcff']
    },

    ];
return cards;
}

//变量内容

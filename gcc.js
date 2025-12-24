function downloadTextAsFile(text, filename) {
    // 步骤1：数据已经通过参数传入（text）
    // 步骤2：创建Blob对象
    const blob = new Blob([text], { type: 'text/plain' });
    // 步骤3：创建对象URL
    const url = URL.createObjectURL(blob);
    // 步骤4：创建下载链接
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    // 步骤5：触发下载
    document.body.appendChild(a);
    a.click();
    // 步骤6：移除下载链接
    document.body.removeChild(a);
    // 步骤7：释放对象URL
    URL.revokeObjectURL(url);
}

function uploadTextAsFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = function () {
        let file = input.files[0];
        if (file) {
            console.log('正在上传文件:', file.name);
            clearAll(Var);
            const reader = new FileReader();
            reader.onload = function (e) {
                const jsonString = e.target.result;
                const data = JSON.parse(jsonString);
                clearAll(Var);
                Var = data.Var;
                cardLinklist = data.cardLinklist;
                links = data.links;
                init();
                InitVar(Var);
                //VarCount = Var.length;
                console.log('数据已上传并恢复:', data);
                //bindInputEvents(Var);
                //绑定输入事件
                //console.log('VarCount:', VarCount);
                //console.log('Var:', Var);

                console.log('Var:', Var);
            };
            reader.readAsText(file);
            console.log('文件:', file);
        }
    };
    input.click();

}
/*拓扑排序*/
function topologicalSort(links, cards) {
    // 创建一个入度为0的节点的列表
    const inDegree = {};
    const graph = {};

    // 初始化每个节点的入度为0
    cards.forEach(card => {
        inDegree[card.id] = 0;
        graph[card.id] = [];
    });

    // 计算每个节点的入度，并构建邻接表
    links.forEach(link => {
        const sourceId = link.source.node.split('-')[0];
        const targetId = link.target.node.split('-')[0];

        if (!graph[sourceId].includes(targetId)) {
            graph[sourceId].push(targetId);
        }
        inDegree[targetId]++;
    });

    // 创建一个队列，存储所有入度为0的节点
    const queue = Object.keys(inDegree).filter(id => inDegree[id] === 0);

    const sortedOrder = [];

    // 当队列不为空时，取出一个节点，并将其相邻节点的入度减1，如果相邻节点的入度变为0，则加入队列
    while (queue.length) {
        const cardId = queue.shift();
        sortedOrder.push(cardId);

        // 减少相邻节点的入度
        graph[cardId].forEach(neighbour => {
            inDegree[neighbour]--;
            if (inDegree[neighbour] === 0) {
                queue.push(neighbour);
            }
        });
    }

    // 如果排序后的节点数等于图中的节点数，则返回排序结果，否则说明图中存在环
    if (sortedOrder.length === cards.length) {
        return sortedOrder;
    } else {
        throw new Error('图中存在环，无法进行拓扑排序');
    }
}

function theCompiler() {

    const order = topologicalSort(links, cardLinklist);
    // 输出排序结果
    console.log('拓扑排序结果:', order);
    const compiledCode = order.map(cardId => {

        const card = cardLinklist.find(card => card.id === cardId);
        return card.code;
        }
        ).join('\n');
        console.log('编译结果:', compiledCode);
    // 下载编译结果
}
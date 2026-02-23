// 检测是否在Pake/Tauri环境中
const isTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined;

// 文件夹配置
const FOLDER_CONFIG = {
    COMPILED_CODE: 'compiled_code',
    DOWNLOADS: 'downloads'
};

// 初始化文件夹（在Tauri环境中）
async function initFolders() {
    if (!isTauri) return;
    
    try {
        const { createDir, exists } = window.__TAURI__.fs;
        
        // 创建compiled_code文件夹
        if (!(await exists(FOLDER_CONFIG.COMPILED_CODE))) {
            await createDir(FOLDER_CONFIG.COMPILED_CODE);
            console.log(`已创建文件夹: ${FOLDER_CONFIG.COMPILED_CODE}`);
        }
        
        // 创建downloads文件夹
        if (!(await exists(FOLDER_CONFIG.DOWNLOADS))) {
            await createDir(FOLDER_CONFIG.DOWNLOADS);
            console.log(`已创建文件夹: ${FOLDER_CONFIG.DOWNLOADS}`);
        }
        
        console.log('文件夹初始化完成');
    } catch (error) {
        console.error('初始化文件夹失败:', error);
    }
}

// 在Tauri环境中保存文件到指定文件夹
async function saveToFolderTauri(text, filename, folderType) {
    try {
        const { writeTextFile, exists, createDir } = window.__TAURI__.fs;
        const folder = FOLDER_CONFIG[folderType];
        
        // 确保文件夹存在
        if (!(await exists(folder))) {
            await createDir(folder);
        }
        
        // 构建完整文件路径
        const filePath = `${folder}/${filename}`;
        await writeTextFile(filePath, text);
        
        console.log(`文件已保存到: ${filePath}`);
        alert(`文件已保存到: ${filePath}`);
        return { success: true, path: filePath };
        
    } catch (error) {
        console.error(`保存文件到${folderType}文件夹失败:`, error);
        return { success: false, error };
    }
}

// 在浏览器环境中保存文件（使用下载）
function saveToFolderBrowser(text, filename, folderType) {
    try {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // 创建下载链接
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        // 添加到文档并触发点击
        document.body.appendChild(a);
        a.click();
        
        // 清理
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
        
        console.log(`文件下载已触发: ${filename} (保存到${FOLDER_CONFIG[folderType]}文件夹)`);
        alert(`文件已下载: ${filename}\n建议手动移动到"${FOLDER_CONFIG[folderType]}"文件夹中`);
        return { success: true, path: `下载到默认下载文件夹/${filename}` };
        
    } catch (error) {
        console.error('浏览器下载失败:', error);
        return { success: false, error };
    }
}

// 保存编译的代码
async function saveCompiledCode(text, filename = 'output.cpp') {
    if (isTauri) {
        return await saveToFolderTauri(text, filename, 'COMPILED_CODE');
    } else {
        return saveToFolderBrowser(text, filename, 'COMPILED_CODE');
    }
}

// 保存JSON数据
async function saveJsonData(text, filename = 'data.json') {
    if (isTauri) {
        return await saveToFolderTauri(text, filename, 'DOWNLOADS');
    } else {
        return saveToFolderBrowser(text, filename, 'DOWNLOADS');
    }
}

// 主下载函数（兼容旧代码）
async function downloadTextAsFile(text, filename) {
    // 根据文件类型决定保存到哪个文件夹
    const isJson = filename.endsWith('.json');
    const isCpp = filename.endsWith('.cpp') || filename.endsWith('.c');
    const isVerilog = filename.endsWith('.v') || filename.endsWith('.sv');
    
    if (isJson) {
        return await saveJsonData(text, filename);
    } else if (isCpp || isVerilog) {
        return await saveCompiledCode(text, filename);
    } else {
        // 其他文件类型，默认保存到downloads文件夹
        if (isTauri) {
            return await saveToFolderTauri(text, filename, 'DOWNLOADS');
        } else {
            return saveToFolderBrowser(text, filename, 'DOWNLOADS');
        }
    }
}

// 初始化（如果是Tauri环境，创建文件夹）
if (isTauri) {
    initFolders().then(() => {
        console.log('Tauri环境文件夹初始化完成');
    }).catch(error => {
        console.error('Tauri环境文件夹初始化失败:', error);
    });
}

function parseNodeId(nodeId) {
    if (typeof nodeId !== 'string') return null;
    const m = nodeId.match(/^(card[^-]*)-node(\d+)$/);
    if (!m) return null;
    return { cardId: m[1], nodeIndex: parseInt(m[2], 10) - 1, nodeNum: parseInt(m[2], 10) };
}

function getNodeWorldPosition(card, nodeIndex) {
    const node = card?.nodes?.[nodeIndex];
    if (!node) return null;
    const nodeSpacing = 50;
    const topBottomPadding = 20;
    const titleBarHeight = 30;
    const x = (card.x ?? 0) + (node.type === 'in' ? 0 : 150);
    const y = 30 + (card.y ?? 0) + topBottomPadding + (node.level + 1) * nodeSpacing - nodeSpacing / 2;
    return { x, y };
}

function normalizeImportedGraph(data) {
    const importedCards = Array.isArray(data?.cardLinklist) ? data.cardLinklist : [];
    const importedLinks = Array.isArray(data?.links) ? data.links : [];

    const oldIdToCardIndices = new Map();
    importedCards.forEach((card, idx) => {
        const oldId = typeof card?.id === 'string' ? card.id : '';
        if (!oldIdToCardIndices.has(oldId)) oldIdToCardIndices.set(oldId, []);
        oldIdToCardIndices.get(oldId).push(idx);
    });

    const newIdsByIndex = importedCards.map((_, idx) => `card${idx}`);

    const remapEndpoint = (endpoint) => {
        const parsed = parseNodeId(endpoint?.node);
        if (!parsed) return;

        const candidateIndices = oldIdToCardIndices.get(parsed.cardId) || [];
        if (candidateIndices.length === 0) return;

        let chosenIdx = candidateIndices[0];
        if (candidateIndices.length > 1 && typeof endpoint?.x === 'number' && typeof endpoint?.y === 'number') {
            let bestDist = Infinity;
            candidateIndices.forEach((idx) => {
                const pos = getNodeWorldPosition(importedCards[idx], parsed.nodeIndex);
                if (!pos) return;
                const dx = pos.x - endpoint.x;
                const dy = pos.y - endpoint.y;
                const d2 = dx * dx + dy * dy;
                if (d2 < bestDist) {
                    bestDist = d2;
                    chosenIdx = idx;
                }
            });
        }

        endpoint.node = `${newIdsByIndex[chosenIdx]}-node${parsed.nodeNum}`;
    };

    importedLinks.forEach((link) => {
        remapEndpoint(link?.source);
        remapEndpoint(link?.target);
    });

    importedCards.forEach((card, idx) => {
        card.id = newIdsByIndex[idx];
    });

    return { Var: Array.isArray(data?.Var) ? data.Var : [], cardLinklist: importedCards, links: importedLinks };
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
                const normalized = normalizeImportedGraph(data);
                clearAll(Var);
                Var = normalized.Var;
                cardLinklist = normalized.cardLinklist;
                links = normalized.links;
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

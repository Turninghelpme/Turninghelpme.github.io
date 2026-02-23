// 检测是否在Pake/Tauri环境中
const isTauri = typeof window !== 'undefined' && window.__TAURI__ !== undefined;

// Tauri下载函数
async function downloadWithTauri(text, filename) {
    try {
        const { writeTextFile } = window.__TAURI__.fs;
        const { dialog } = window.__TAURI__;
        
        // 让用户选择保存位置
        const filePath = await dialog.save({
            defaultPath: filename,
            filters: [{
                name: 'Text Files',
                extensions: ['txt', 'json', 'cpp', 'v', 'js', 'html', 'css']
            }]
        });
        
        if (filePath) {
            await writeTextFile(filePath, text);
            alert(`文件已保存到: ${filePath}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Tauri下载失败:', error);
        // 回退到标准方法
        return false;
    }
}

// 标准下载方法
function downloadWithStandardMethod(text, filename) {
    try {
        // 方法1：标准Blob下载方法（适用于大多数现代浏览器）
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
        
        console.log(`文件下载已触发: ${filename}`);
        return true;
        
    } catch (error) {
        console.error('标准下载方法失败:', error);
        return false;
    }
}

// 备用下载方法
function downloadWithFallback(text, filename) {
    try {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
        console.log('已使用window.open打开文件，请手动保存');
        alert(`文件已生成，请在新窗口中手动保存为: ${filename}\n如果新窗口没有打开，可能是浏览器安全设置限制。`);
        return false;
        
    } catch (error) {
        console.error('备用下载方法也失败:', error);
        return false;
    }
}

// 主下载函数
async function downloadTextAsFile(text, filename) {
    // 如果在Tauri/Pake环境中，优先使用Tauri API
    if (isTauri) {
        const tauriResult = await downloadWithTauri(text, filename);
        if (tauriResult) return true;
        // 如果Tauri失败，继续尝试其他方法
    }
    
    // 尝试标准方法
    if (downloadWithStandardMethod(text, filename)) {
        return true;
    }
    
    // 尝试备用方法
    if (downloadWithFallback(text, filename)) {
        return true;
    }
    
    // 所有方法都失败，提供详细错误信息
    console.error('所有下载方法都失败');
    alert(`无法自动下载文件 ${filename}。\n\n` +
          `可能的原因：\n` +
          `1. 从本地文件(file://)打开时浏览器安全限制\n` +
          `2. 桌面应用环境需要特殊配置\n\n` +
          `解决方案：\n` +
          `1. 使用本地HTTP服务器运行此应用\n` +
          `   - Python: python -m http.server 8000\n` +
          `   - Node.js: npx http-server\n` +
          `2. 如果是Electron应用，请启用webSecurity: false\n` +
          `3. 如果是Pake/Tauri应用，请确保已配置正确的权限\n` +
          `4. 手动复制以下内容到文件中保存:\n\n` +
          text.substring(0, 500) + (text.length > 500 ? '...' : ''));
    
    // 将文本复制到剪贴板作为备用方案
    try {
        navigator.clipboard.writeText(text).then(() => {
            console.log('内容已复制到剪贴板');
        });
    } catch (clipboardError) {
        console.error('无法复制到剪贴板:', clipboardError);
    }
    
    return false;
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

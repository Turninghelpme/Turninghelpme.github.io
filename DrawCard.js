/// This file is used to generate the SVG cards for the game.
///大佬的代码能不动就不动。
///这股力量不属于我们，请不要再动它。
///除非要加东西
//引用Variables.js文件
//import { cardLinklist } from './Variables.js';
function drawCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // 清除现有的卡片

    cardLinklist.forEach(card => {

        //创建标题栏渐变色
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        linearGradient.setAttribute('id', `titleGradient-${card.id}`);
        linearGradient.setAttribute('x1', '0%'); // 渐变起点的x坐标
        linearGradient.setAttribute('y1', '100%'); // 渐变起点的y坐标
        linearGradient.setAttribute('x2', '100%'); // 渐变终点的x坐标
        linearGradient.setAttribute('y2', '0%'); // 渐变终点的y坐标

        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '10%');
        stop1.setAttribute('style', `stop-color: ${card.titleBarColor[0]}; stop-opacity: 1`);
        linearGradient.appendChild(stop1);

        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', `stop-color: ${card.titleBarColor[1]}; stop-opacity: 1`);
        linearGradient.appendChild(stop2);

        defs.appendChild(linearGradient);
        cardsContainer.appendChild(defs);



        const nodeSpacing = 50;
        const topBottomPadding = 20;
        const titleBarHeight = 30; // 标题栏高度
        const maxLevel = Math.max(...card.nodes.map(node => node.level)) + 1;
        const cardHeight = maxLevel * nodeSpacing + topBottomPadding * 2 + titleBarHeight;

        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'draggable card-container');
        group.setAttribute('data-id', card.id);
        group.setAttribute('user-select', 'none');
        group.setAttribute('transform', `translate(${card.x},${card.y})`);

        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', '#222');
        rect.setAttribute('width', 150);
        rect.setAttribute('style', 'cursor: auto;');
        rect.setAttribute('height', cardHeight);
        rect.setAttribute('rx', 10); // 圆角
        rect.setAttribute('ry', 10);
        group.appendChild(rect);

        // 使用path绘制带有指定圆角的矩形
        // 创建标题栏
        const titleBarWidth = 150;
        const borderRadius = 10; // 圆角大小
        const titleBar = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dValue = `M 0,${borderRadius}
                a ${borderRadius},${borderRadius} 0 0 1 ${borderRadius},-${borderRadius}
                h ${titleBarWidth - borderRadius * 2}
                a ${borderRadius},${borderRadius} 0 0 1 ${borderRadius},${borderRadius}
                v ${titleBarHeight - borderRadius}
                h -${titleBarWidth}
                z`;
        titleBar.setAttribute('class', 'card');
        titleBar.setAttribute('d', dValue);
        titleBar.setAttribute('fill', `url(#titleGradient-${card.id})`);
        group.appendChild(titleBar);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', titleBarWidth / 2);
        text.setAttribute('y', titleBarHeight / 2);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('alignment-baseline', 'middle');
        text.textContent = card.label;
        group.appendChild(text);

        card.nodes.forEach((node, index) => {


            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('class', 'node');
            circle.setAttribute('cx', node.type === 'in' ? 0 : 150);
            circle.setAttribute('cy', topBottomPadding + titleBarHeight + (node.level + 1) *
                nodeSpacing - (nodeSpacing / 2));
            circle.setAttribute('r', 7);
            circle.setAttribute('fill', node.color);
            circle.setAttribute('data-card-id', card.id);
            circle.setAttribute('data-node-id', `${card.id}-node${index + 1}`);
            group.appendChild(circle);

            let labelX = node.type === 'in' ? 12 : 138; // 基本的X坐标
            const labelY = topBottomPadding + titleBarHeight + node.level * nodeSpacing + 21;

            // 创建SVG文本元素
            const multiConnectedLabel = document.createElementNS('http://www.w3.org/2000/svg',
                'text');
            multiConnectedLabel.setAttribute('x', labelX);
            multiConnectedLabel.setAttribute('y', labelY);
            multiConnectedLabel.setAttribute('text-anchor', 'middle');
            multiConnectedLabel.setAttribute('fill', '#aaa');
            multiConnectedLabel.setAttribute('style', 'font-size: 8px;');
            multiConnectedLabel.setAttribute('alignment-baseline', 'hanging');


            // 计算文本的宽度（假定的，因为SVG没有直接获取文本宽度的方法）
            let estimatedTextLength;
            if (node.multiConnected == undefined) {
                estimatedTextLength = 20
                multiConnectedLabel.textContent = 'N';
            } else {
                estimatedTextLength = node.multiConnected.length;
                multiConnectedLabel.textContent = node.multiConnected;
            }

            // 确保文本不会超出卡片右边界
            if (labelX + estimatedTextLength / 2 > 150) {
                labelX = 150 - estimatedTextLength / 2;
                nodeLabel.setAttribute('x', labelX);
            }

            // 确保文本不会超出卡片左边界
            if (labelX - estimatedTextLength / 2 < 0) {
                labelX = estimatedTextLength / 2;
                nodeLabel.setAttribute('x', labelX);
            }

            group.appendChild(multiConnectedLabel);

            if (node.label != undefined) {
                // 计算文本标签的位置
                let labelX = node.type === 'in' ? 15 : 135; // 基本的X坐标
                const labelY = topBottomPadding + titleBarHeight + node.level * nodeSpacing + 40;

                // 创建SVG文本元素
                const nodeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                nodeLabel.setAttribute('x', labelX);
                nodeLabel.setAttribute('y', labelY); // 在节点下方留出一定空间
                nodeLabel.setAttribute('text-anchor', 'middle'); // 文本居中对齐
                nodeLabel.setAttribute('fill', '#aaa'); // 文本居中对齐
                nodeLabel.setAttribute('alignment-baseline', 'hanging');
                nodeLabel.textContent = node.label;

                // 计算文本的宽度（假定的，因为SVG没有直接获取文本宽度的方法）
                const estimatedTextLength = node.label.length * 10; // 估算每个字符6像素宽

                // 确保文本不会超出卡片右边界
                if (labelX + estimatedTextLength / 2 > 150) {
                    labelX = 150 - estimatedTextLength / 2;
                    nodeLabel.setAttribute('x', labelX);
                }

                // 确保文本不会超出卡片左边界
                if (labelX - estimatedTextLength / 2 < 0) {
                    labelX = estimatedTextLength / 2;
                    nodeLabel.setAttribute('x', labelX);
                }

                group.appendChild(nodeLabel);

            }

            switch (node.slot) {
                case 'input':
                    const foreignObject = document.createElementNS('http://www.w3.org/2000/svg',
                        'foreignObject');
                    foreignObject.setAttribute('x', 0);
                    foreignObject.setAttribute('y', topBottomPadding + titleBarHeight + node.level *
                        nodeSpacing + 12);
                    foreignObject.setAttribute('width', 130); // 保持原始宽度
                    foreignObject.setAttribute('height', nodeSpacing - 24); // 保持原始高度，减去的24像素为上下内边距之和
                    const input = document.createElement('input');
                    input.type = 'text';
                    if (node.value == undefined) {
                        node.value = '';
                    }
                    input.value = node.value;
                    input.addEventListener('input', function () {
                        node.value = input.value;
                    });
                    // Set adjusted input styles
                    input.style.width = '110px';
                    input.style.height = '100%';
                    input.style.marginLeft = '20px';
                    input.style.borderRadius = '5px';
                    input.style.border = '1px solid white';
                    input.style.backgroundColor = '#222';
                    input.style.color = 'white';
                    input.style.fontSize = '1em';
                    input.style.padding = '0px'; // 可能需要调整或去除内边距以适应固定尺寸
                    input.style.boxSizing = 'border-box'; // 确保宽高包含内容、内边距和边框

                    // Change border color on focus and blur
                    input.addEventListener('focus', () => {
                        input.style.outline = 'none'; // Remove default focus outline
                        input.style.borderColor =
                            'white'; // Keep border color white on focus
                    });

                    input.addEventListener('blur', () => {
                        input.style.borderColor =
                            'white'; // Revert to white when not focused
                    });

                    // 阻止事件冒泡
                    input.addEventListener('click', function (event) {
                        event.stopPropagation();
                    });

                    input.addEventListener('mousedown', function (event) {
                        event.stopPropagation();
                    });

                    input.addEventListener('touchstart', function (event) {
                        event.stopPropagation();
                    });

                    foreignObject.appendChild(input);
                    group.appendChild(foreignObject);
                    break;
            }



        });

        const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        deleteIcon.setAttribute('class', 'card-delete-icon');
        deleteIcon.setAttribute('x', 125);
        deleteIcon.setAttribute('y', 5); // 使其贴近标题栏的右上角
        deleteIcon.setAttribute('width', 20);
        deleteIcon.setAttribute('height', 20);
        deleteIcon.setAttribute('fill', 'transparent');
        deleteIcon.setAttribute('data-card-id', card.id);
        deleteIcon.setAttribute('style', 'cursor: pointer;');
        group.appendChild(deleteIcon);

        const delText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        delText.setAttribute('x', 135);
        delText.setAttribute('y', 20); // 调整位置以垂直居中
        delText.setAttribute('text-anchor', 'middle');
        delText.setAttribute('fill', 'white');
        delText.setAttribute('font-size', '16px'); // 适当调整字体大小以适应图标
        delText.setAttribute('pointer-events', 'none'); // 确保点击事件只触发于删除图标上
        delText.textContent = '×';
        group.appendChild(delText);

        cardsContainer.appendChild(group);
    });

    attachNodeEventListeners();
}



function drawLinks() {
    const linksContainer = document.getElementById('linksContainer');
    linksContainer.innerHTML = ''; // 清除现有的线条
    // 清除旧的删除图标
    document.querySelectorAll('.delete-icon').forEach(icon => icon.remove());

    links.forEach((link, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        //path.setAttribute('class', 'link');
        path.setAttribute('stroke', link.target.color)
        path.setAttribute('stroke-width', 5)
        path.setAttribute('fill', 'none');


        const isCallType = link.source.enumType === 'call';
        if (isCallType) {
            path.setAttribute('stroke-dasharray', '10');
            path.setAttribute('stroke-dashoffset', '0');

            // Add animation element to the path for dashed lines
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'stroke-dashoffset');
            animate.setAttribute('dur', '0.5s');
            animate.setAttribute('repeatCount', 'indefinite');
            animate.setAttribute('from', '20');
            animate.setAttribute('to', '0');
            path.appendChild(animate);
        }


        let dist;
        // 使用动态计算的控制点距离来定义曲线,根据源点和终点的X坐标差异动态计算控制点的距离
        if (link.source.type === 'out') {
            if (link.source.x - link.target.x > 0) {
                dist = 200; // 如果终点在源点的左侧，控制点距离更远
            } else {
                dist = Math.abs(link.target.x - link.source.x) * 0.3; // 否则，根据两点间的距离调整控制点距离
            }
            const d =
                `M${link.source.x} ${link.source.y} C${link.source.x + dist} ${link.source.y} ${link.target.x - dist} ${link.target.y} ${link.target.x} ${link.target.y}`;
            path.setAttribute('d', d);
            linksContainer.appendChild(path);
        } else {
            if (link.target.x - link.source.x > 0) {
                dist = 200; // 如果终点在源点的右侧，控制点距离更远
            } else {
                dist = Math.abs(link.target.x - link.source.x) * 0.3; // 否则，根据两点间的距离调整控制点距离
            }
            const d =
                `M${link.source.x} ${link.source.y} C${link.source.x - dist} ${link.source.y} ${link.target.x + dist} ${link.target.y} ${link.target.x} ${link.target.y}`;
            path.setAttribute('d', d);
            linksContainer.appendChild(path);
        }


        // 计算中点
        const midX = (link.source.x + link.target.x) / 2;
        const midY = (link.source.y + link.target.y) / 2;

        // 绘制删除图标
        const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        deleteIcon.setAttribute('class', 'delete-icon');
        deleteIcon.setAttribute('cx', midX);
        deleteIcon.setAttribute('cy', midY);
        deleteIcon.setAttribute('style', "cursor: pointer;");
        deleteIcon.setAttribute('r', 10);
        deleteIcon.setAttribute('fill', 'red');
        deleteIcon.setAttribute('data-link-level', index); // 用于标识该删除图标对应的线
        linksContainer.appendChild(deleteIcon);

        // 可以选择添加一个×文本在圆圈中间
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', midX);
        text.setAttribute('y', midY + 5); // 轻微调整以垂直居中
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '15px');
        text.setAttribute('pointer-events', 'none'); // 确保点击事件只触发于圆圈上
        text.textContent = '×';
        linksContainer.appendChild(text);

    });
}

function decrementCardIndex(cardStr) {
    // 使用正则表达式匹配 card 后面的数字
    const match = cardStr.match(/card\((\d+)\)/);
    if (match) {
        // 提取数字并转换为整数
        const index = parseInt(match[1], 10);
        // 减1后重新构造字符串
        const newCardStr = `card(${index - 1})`;
        return newCardStr;
    }
    return cardStr;
}

function attachEventListeners() {

    const svgContainer = document.getElementById('svgContainer');
    document.querySelectorAll('.link').forEach(link => {
        link.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // 阻止默认的右键菜单
            const linkId = e.target.getAttribute('data-link-id'); // 确保你在绘制线条时添加了 data-link-id 属性
            showContextMenu(e.clientX, e.clientY, linkId);
        });
    });
    document.getElementById('svgContainer').addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-icon')) {
            // 获取点击的删除图标对应的线的索引
            const linkIndex = e.target.getAttribute('data-link-level');
            // 从数组中移除该线
            links.splice(linkIndex, 1);

            // 重新绘制剩余的线和删除图标
            drawLinks();
            drawCards(); // 如果你的线条与卡片有关联，可能需要重新绘制卡片以更新视图
        } else if (e.target.classList.contains('card-delete-icon')) {
            // 获取点击的删除图标对应的卡片ID
            const cardId = e.target.getAttribute('data-card-id');
            // 从`cards`数组中移除对应的卡片
            cardLinklist = cardLinklist.filter(card => card.id !== cardId);
            // 同时移除所有与该卡片连接的线
            links = links.filter(link => !(link.source.node.startsWith(cardId) || (link.target && link.target
                .node.startsWith(cardId))));

            //TODO: 这里需要更新cardLinklist和links数组中的ID
            //TODO:完成了
            const idxToDelete = parseInt(cardId.replace(/\D/g, ''), 10);

            // 只处理序号大于 idxToDelete 的卡片
            cardLinklist.forEach(c => {
                const oldIdx = parseInt(c.id.replace(/\D/g, ''), 10);
                if (oldIdx > idxToDelete) {
                    c.id = c.id.replace(/\d+/, oldIdx - 1);
                }
            });

            // 2. 重排连线两端
            links.forEach(l => {
                ['source', 'target'].forEach(k => {
                    if (!l[k]?.node) return;
                    // 节点名形如 card{n}-node{x}，把卡片序号减 1
                    l[k].node = l[k].node.replace(/card(\d+)/, (_, m) =>
                        +m > idxToDelete ? `card${m - 1}` : `card${m}`
                    );
                });
            });
            // 重新绘制卡片和线
            drawLinks();
            drawCards();


        } else {
            let targetCardContainer = e.target.closest('.card-container');
            if (targetCardContainer) {
                const cardId = targetCardContainer.getAttribute('data-id');
                // 将SVG元素移动到最后，使其在视觉上显示在最前面
                targetCardContainer.parentNode.appendChild(targetCardContainer);



                // 这里不需要立即调用drawCards或drawLinks，
                // 除非你需要根据cards数组的新顺序进行其他更新
            }
        }
    });

    svgContainer.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // 阻止右键菜单
    });

    svgContainer.addEventListener('mousedown', e => {

        // 检查是否是鼠标右键点击

        const target = e.target;
        if (e.button === 2) {
            isPanning = true;
            startPan.x = e.clientX - currentPan.x;
            startPan.y = e.clientY - currentPan.y;
        } else if (target

            .classList.contains('card') || target.tagName === 'text') {
            const cardContainer = target.closest('.card-container');
            const cardId = cardContainer.getAttribute('data-id');
            startDragCard(e, cardId);
        }
    });
    document.addEventListener('mousemove', e => {
        if (isPanning) {
            // 正确计算新的视图窗口位置
            currentPan.x = e.clientX - startPan.x;
            currentPan.y = e.clientY - startPan.y;

            // 正确调整SVG的viewBox来实现拖动效果
            // 这里需要更新的是开始拖动的点，而不是当前的点，因此我们反向更新
            svgContainer.setAttribute('viewBox',
                `${-currentPan.x} ${-currentPan.y} ${svgContainer.clientWidth} ${svgContainer.clientHeight}`
            );
            svgContainer.style.backgroundPosition = `${currentPan.x % 100}px ${currentPan.y % 100}px`;
        } else if (isDragging) {
            moveCard(e);
        } else if (isLinking && currentLink) {
            updateLink(e);
        }
    });

    document.addEventListener('mouseup', e => {
        if (e.button === 2) {
            console.log(currentPan);
            isPanning = false;
        } else if (isDragging) {
            endDragCard();
        } else if (isLinking) {
            endDragLink(e);
        }
    });

}

function startDragCard(e, cardId) {
    isDragging = true;
    //try
    const card = cardLinklist.find(c => c.id === cardId);
    currentCard = card;

    const svgRect = svgContainer.getBoundingClientRect();
    dragOffsetX = e.clientX - svgRect.left - card.x;
    dragOffsetY = e.clientY - svgRect.top - card.y;
}

function moveCard(e) {
    const svgRect = svgContainer.getBoundingClientRect();
    currentCard.x = e.clientX - svgRect.left - dragOffsetX;
    currentCard.y = e.clientY - svgRect.top - dragOffsetY;
    //菜单要调用下面这句话
    currentCardData = currentCard;
    // Update link positions associated with the currentCard
    links.forEach(link => {
        if (link.source.node.startsWith(currentCard.id)) {
            // 根据节点ID更新链接的源位置
            const nodeIndex = parseInt(link.source.node.split('-node')[1]) - 1;
            const nodeConfig = currentCard.nodes[nodeIndex]; // 获取当前节点的配置
            const nodeSpacing = 50; // 节点间隔，应与drawCards函数中使用的相同
            const topBottomPadding = 20; // 顶部和底部的边距，应与drawCards函数中使用的相同
            link.source.x = currentCard.x + (nodeConfig.type === "in" ? 0 : 150); // 根据节点类型调整x坐标
            link.source.y = 30 + currentCard.y + topBottomPadding + (nodeConfig.level + 1) * nodeSpacing - (
                nodeSpacing / 2); // 根据节点的index调整y坐标
        }
        if (link.target && link.target.node.startsWith(currentCard.id)) {
            // 根据节点ID更新链接的目标位置
            const nodeIndex = parseInt(link.target.node.split('-node')[1]) - 1;
            const nodeConfig = currentCard.nodes[nodeIndex]; // 获取当前节点的配置
            link.target.x = currentCard.x + (nodeConfig.type === "in" ? 0 : 150); // 根据节点类型调整x坐标
            link.target.y = 30 + currentCard.y + 20 + (nodeConfig.level + 1) * 50 - (50 /
                2); // 根据节点的index调整y坐标
        }
    });

    //当左键按下时，点击card时，显示当前卡片的详细信息
    document.getElementById('currentCardData-title').textContent = currentCardData.label || '当前卡片信息';
    document.getElementById('currentCardData-id').textContent = 'ID: ' + currentCardData.id;
    document.getElementById('currentCardData-type').textContent = '类型: ' + currentCardData.type;
    document.getElementById('currentCardData-nodes').textContent = '节点: ' + currentCardData.nodes.length;
    document.getElementById('currentCardData-position').textContent = '位置: (' + currentCardData.x + ',' + currentCardData.y + ')';
    document.getElementById('currentCardData-titlebarcolor').textContent = '标题栏颜色: ' + currentCardData.titleBarColor;
    //TODO: 看看是不是condition,是的话，显示condition的设定模块
    judgeCard(currentCardData,cardLinklist);
    //TODO: 显示当前卡片的详细信息
   
    // 先统一把特殊样式清掉



    drawLinks(); // Redraw links to reflect updated positions
    drawCards(); // Redraw cards and nodes
}



function endDragCard() {
    isDragging = false;
}

function getNodeCurrentConnections(nodeId) {
    let count = 0;
    links.forEach(link => {
        if (link.source.node === nodeId || (link.target && link.target.node === nodeId)) {
            count++;
        }
    });
    return count;
}

function startDragLink(e) {
    e.stopPropagation(); // Prevent card drag

    const nodeId = e.target.getAttribute('data-node-id');
    const cardId = e.target.getAttribute('data-card-id');

    const card = cardLinklist.find(c => c.id === cardId);
    const nodeElement = e.target;
    const node = card.nodes.find(n => `${card.id}-node${card.nodes.indexOf(n) + 1}` === nodeId);


    // 检查源节点是否允许发起新的连接
    const currentConnections = getNodeCurrentConnections(nodeId);
    if (node.multiConnected !== -1 && currentConnections >= node.multiConnected) {
        console.log('此节点不允许更多的连接。');
        return; // 不允许创建新的连接
    }
    isLinking = true;

    const svgRect = svgContainer.getBoundingClientRect();
    const nodeX = e.clientX - svgRect.left;
    const nodeY = e.clientY - svgRect.top;

    currentLink = {
        source: {
            node: nodeId,
            x: nodeX,
            y: nodeY,
            color: nodeElement.getAttribute('fill'),
            type: node.type,
            enumType: node.enumType
        },
        target: null
    };
}

function updateLink(e) {
    const svgRect = svgContainer.getBoundingClientRect();
    currentLink.target = {
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top
    };
    drawCurrentLink();
}

function endDragLink(e) {
    isLinking = false;
    const svgRect = svgContainer.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    // 默认情况下，假设目标节点就是e.target
    let targetNode = e.target;

    // 检查e.target是否是我们期望的节点类型，如果不是，则尝试使用document.elementFromPoint
    if (!targetNode.classList.contains('node')) {
        e.target.style.display = 'none';
        targetNode = document.elementFromPoint(e.clientX, e.clientY);
        e.target.style.display = '';
    }

    let validTargetFound = false;

    // 进行节点的有效性判断
    if (targetNode && targetNode.classList.contains('node')) {
        const sourceNodeId = currentLink.source.node;
        const targetNodeId = targetNode.getAttribute('data-node-id');

        // 从节点ID分解出卡片ID和节点索引
        const sourceNodeParts = sourceNodeId.split('-node');
        const targetNodeParts = targetNodeId.split('-node');
        const sourceCard = cardLinklist.find(card => card.id === sourceNodeParts[0]);
        const targetCard = cardLinklist.find(card => card.id === targetNodeParts[0]);

        // 根据节点ID找到对应的节点对象
        const sourceNodeIndex = parseInt(sourceNodeParts[1]) - 1;
        const targetNodeIndex = parseInt(targetNodeParts[1]) - 1;
        const sourceNode = sourceCard.nodes[sourceNodeIndex];
        const targetNodeObj = targetCard.nodes[targetNodeIndex];

        // 检查目标节点是否允许接受新的连接
        const targetCurrentConnections = getNodeCurrentConnections(targetNodeId);
        if (targetNodeObj.multiConnected !== -1 && targetCurrentConnections >= targetNodeObj.multiConnected) {
            console.log('目标节点不允许更多的连接。');
            // 移除临时绘制的连接线
            const tempLink = document.querySelector('.temp-link');
            if (tempLink) {
                tempLink.remove();
            }
            currentLink = null;
            drawLinks();
            return;
        }
        // 确保目标节点不是起始节点自身，避免自连接
        if (currentLink.source.node !== targetNodeId && sourceNode.enumType === targetNodeObj.enumType) {
            validTargetFound = true;
            currentLink.source.enumType = sourceNode.enumType;
            currentLink.source.x = currentLink.source.x - currentPan.x;
            currentLink.source.y = currentLink.source.y - currentPan.y;
            // 更新连接的目标信息，并保存该连接
            links.push({
                ...currentLink,
                target: {
                    node: targetNodeId,
                    x: x - currentPan.x,
                    y: y - currentPan.y,
                    color: sourceNode.color,
                    enumType: sourceNode.enumType
                }
            });
        }
    } else {
        const sourceNodeId = currentLink.source.node;
        const sourceNodeParts = sourceNodeId.split('-node');
        const sourceCard = cardLinklist.find(card => card.id === sourceNodeParts[0]);
        const sourceNodeIndex = parseInt(sourceNodeParts[1]) - 1;
        const sourceNode = sourceCard.nodes[sourceNodeIndex];
        currentLink.source.enumType = sourceNode.enumType;
        showCardCreationModal(e.clientX, e.clientY, currentLink.source);

    }

    const tempLink = document.querySelector('.temp-link');
    if (tempLink) {
        tempLink.remove();
    }
    currentLink = null;

    drawLinks();
}






// 更新drawCurrentLink函数，增加线宽
// 更新drawCurrentLink函数，增加线宽
function drawCurrentLink() {
    const tempLink = document.querySelector('.temp-link');
    if (tempLink) tempLink.remove();

    if (!currentLink || !currentLink.target) return;

    const svgContainer = document.getElementById('svgContainer');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'temp-link');
    // 设置等宽线属性
    path.setAttribute('stroke', currentLink.source.color);
    path.setAttribute('stroke-width', 5);
    path.setAttribute('fill', 'none');

    // 计算考虑了平移偏移的起点和终点
    const adjustedSourceX = currentLink.source.x - currentPan.x;
    const adjustedSourceY = currentLink.source.y - currentPan.y;
    const adjustedTargetX = currentLink.target.x - currentPan.x;
    const adjustedTargetY = currentLink.target.y - currentPan.y;

    // 更新路径以使用调整后的坐标
    if (currentLink.source.type === 'out') {
        const d =
            `M${adjustedSourceX},${adjustedSourceY} C${adjustedSourceX + 100},${adjustedSourceY} ${adjustedTargetX - 100},${adjustedTargetY} ${adjustedTargetX},${adjustedTargetY}`;
        path.setAttribute('d', d);
    } else {
        const d =
            `M${adjustedSourceX},${adjustedSourceY} C${adjustedSourceX - 100},${adjustedSourceY} ${adjustedTargetX + 100},${adjustedTargetY} ${adjustedTargetX},${adjustedTargetY}`;
        path.setAttribute('d', d);
    }

    svgContainer.appendChild(path);
}

function attachNodeEventListeners() {
    document.querySelectorAll('.node').forEach(node => {
        node.addEventListener('mousedown', startDragLink);
    });
}

function populateCardTypeList(mouseX, mouseY, sourceNode) {

    cards.forEach(card => {
        if (!addedTypes.has(card.type)) {
            const listItem = document.createElement('li');
            listItem.tabIndex = 0; // 使元素能够获得焦点，以便能够监听键盘事件
            listItem.textContent = card.label; // 使用卡片的标签或类型
            listItem.onclick = function () {
                createNewCard(card, mouseX, mouseY, sourceNode);
                hideCardCreationModal(); // 新建卡片后隐藏模态框
            };
            listItem.onkeydown = function (event) {
                if (event.key === 'Enter') {
                    createNewCard(card, mouseX, mouseY, sourceNode);
                    hideCardCreationModal(); // 新建卡片后隐藏模态框
                }
            };
            listElement.appendChild(listItem);
            addedTypes.add(card.type);
        }
    });
}

function populateCardTypeList(mouseX, mouseY, sourceNode) {
    const listContainer = document.getElementById('card-creation-modal');
    const listElement = document.getElementById('card-type-list');
    listElement.innerHTML = ''; // 清空现有列表项
    const addedTypes = new Set();
    let count = 0; // 计数器，用于限制显示的列表项数量

    cards.forEach(card => {
        if (!addedTypes.has(card.type)) {
            const listItem = document.createElement('li');
            listItem.tabIndex = 0; // 使元素能够获得焦点，以便能够监听键盘事件
            listItem.textContent = card.label; // 使用卡片的标签或类型
            listItem.onclick = function () {
                createNewCard(card, mouseX, mouseY, sourceNode);
                hideCardCreationModal(); // 新建卡片后隐藏模态框
            };
            listItem.onkeydown = function (event) {
                if (event.key === 'Enter') {
                    createNewCard(card, mouseX, mouseY, sourceNode);
                    hideCardCreationModal(); // 新建卡片后隐藏模态框
                }
            };
            listElement.appendChild(listItem);
            addedTypes.add(card.type);
            count++;
        } else if (!addedTypes.has(card.type)) {
            // 对于超过6个的列表项，只添加到Set中，但不显示
            addedTypes.add(card.type);
        }
    });

    // 如果列表项数量超过6个，确保容器可以滚动
    if (cards.length > 6) {
        listContainer.style.height = '200px'; // 确保容器高度固定
        listContainer.style.overflowY = 'auto'; // 添加垂直滚动条
    } else {
        listContainer.style.height = 'auto'; // 如果列表项不足6个，高度自适应
        listContainer.style.overflowY = 'visible'; // 隐藏滚动条
    }
}

function showCardCreationModal(mouseX, mouseY, sourceNode) {
    populateCardTypeList(mouseX, mouseY, sourceNode); // 填充卡片类型列表
    const modal = document.getElementById('card-creation-modal');
    // 在这里添加取消按钮
    if (!document.getElementById('cancel-btn')) {
        const cancelButton = document.createElement('button');
        cancelButton.id = 'cancel-btn';
        cancelButton.textContent = '取消';
        cancelButton.onclick = function () {
            hideCardCreationModal();
        };
        modal.appendChild(cancelButton);
    }
    
    // 设置弹出框的位置
    modal.style.left = mouseX + 'px';
    modal.style.top = mouseY + 'px';
    modal.style.display = 'block'; // 显示弹窗
}

function createNewCard(cardTemplate, mouseX, mouseY, sourceNode) {
    const newCard = {
        ...cardTemplate,
        nodes: JSON.parse(JSON.stringify(cardTemplate.nodes)), // 深拷贝nodes属性
        //TODO
        id: `card${cardLinklist.length}`, // 为卡片分配IDcard
    };
    // 将每个node的value设置为空字符串
    newCard.nodes.forEach(node => {
        node.value = '';
    });
    newCard.x = mouseX - 75 - currentPan.x; // 调整为鼠标中心
    newCard.y = mouseY - 15 - currentPan.y; // 调整为鼠标中心
    cardLinklist.push(newCard); // 将新创建的卡片添加到卡片列表中

    // 如果提供了sourceNode，找到新卡片的合适target node并创建连接
    if (sourceNode) {
        sourceNode.x -= currentPan.x;
        sourceNode.y -= currentPan.y;
        let targetNode = newCard.nodes.find(node => node.enumType === sourceNode.enumType && node.type === 'in');
        if (targetNode) {
            links.push({
                source: sourceNode,
                target: {
                    node: `${newCard.id}-node${newCard.nodes.indexOf(targetNode) + 1}`,
                    x: newCard.x + (targetNode.type === 'in' ? 0 : 150),
                    y: newCard.y + 30 + 20 + (targetNode.level + 1) * 50 - 25,
                    color: targetNode.color,
                    enumType: targetNode.enumType
                }
            });
        }
    }


    drawLinks();
    drawCards();
}



function hideCardCreationModal() {
    const modal = document.getElementById('card-creation-modal');
    modal.style.display = 'none'; // 隐藏弹窗
}

function removeCard(cardId) {
    const cardIndex = cardLinklist.findIndex(card => card.id === cardId);
    if (cardIndex !== -1) {
        cardLinklist.splice(cardIndex, 1);
        // 同时移除所有与该卡片连接的线
        links = links.filter(link => !(link.source.node.startsWith(cardId) || (link.target && link.target.node.startsWith(cardId))));
        drawLinks();
        drawCards();
    }
}


function removeLink(link) {
    const linkIndex = links.findIndex(l => l.source.node === link.source.node && l.target.node === link.target.node);
    if (linkIndex !== -1) {
        links.splice(linkIndex, 1);
        drawLinks();
    }
}
function printLinks(links) {

    for (let i = 0; i < cardLinklist.length; i++) {
        console.log(cardLinklist[i].id, cardLinklist[i].label);
    }

    for (let i = 0; i < links.length; i++) {
        console.log(links[i].source.node, links[i].target.node);
    }
}

function init() {
    drawLinks();
    drawCards();
    attachEventListeners();
}

function startcard() {
    // 创建起始卡片
    const startCard = {
        id: `card${cardLinklist.length}`,
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
        }],
        titleBarColor: ['#84fab0', '#8fd3f4']
    };
    cardLinklist.push(startCard);
    drawCards();

}
//TODO


//当cardLinklist被点击时触发
//绘制右侧菜单
/*
1.节点信息：节点类型、枚举类型、值、描述
2.连接信息：连接类型、枚举类型、值、描述
3.卡片信息：卡片类型、标签、描述
*/

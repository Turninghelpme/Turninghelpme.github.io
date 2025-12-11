//import stdCardKind from './lib/stdCard.json' assert { type: 'json' };

//将json变为对象
function getStdCardKind() {
    
    console.log("stdCardKind:", stdCardKind);
    return stdCardKind;
    
}
//变量内容



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


function judgeCard(currentCardData, cardLinklist) {
    const radioGroup = document.querySelector('.condition-radio-group');

    if (currentCardData.type === '判断') {
        radioGroup.style.display = 'block';
    } else {
        radioGroup.style.display = 'none';
        radioGroup.querySelectorAll('input').forEach(r => r.checked = false);
    }

    // 使用 const 或 let 声明变量
    const checkedValue = document.querySelector('input[name="cond"]:checked')?.value;
    if(checkedValue != undefined) {
        var JudgeState = checkedValue;
    }

    // 确保这些变量已定义或传入
    if (currentCardData.type === "判断" && JudgeState) {
        cardLinklist[Number(currentCardData.id.replace(/\D/g, ''))].state = JudgeState;
        cardLinklist[Number(currentCardData.id.replace(/\D/g, ''))].label = JudgeState;
    }
}
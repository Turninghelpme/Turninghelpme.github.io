function ValueButton(Var) {
    // 初始化显示已有的变量

    createValue(Var);
    deleteVariable(Var);
}

function InitVar(Var) {
    for (let i = 0; i < Var.length; i++) {
        createVariableBox(Var, i);
    }

    //bindInputEvents(Var);
}

// 创建变量框的辅助函数
function createVariableBox(Var, index) {
    const div = document.createElement('div');
    div.className = 'variety_box';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.alignItems = 'center';
    div.style.justifyContent = 'center';
    div.style.gap = '5px';
    div.style.position = 'relative';
    div.dataset.index = index; // 存储数组索引

    // 创建显示编号的元素
    let numberDiv = document.createElement('div');
    numberDiv.textContent = `编号: ${Var[index].id}`;
    numberDiv.style.marginBottom = '10px';
    div.appendChild(numberDiv);

    // 创建显示名称的输入框
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'variety_input';
    nameInput.placeholder = '名称';
    nameInput.value = Var[index].name || '';
    nameInput.dataset.field = 'name'; // 标记字段类型
    div.appendChild(nameInput);

    // 创建显示变量类型的输入框
    const typeInput = document.createElement('input');
    typeInput.type = 'text';
    typeInput.className = 'variety_input';
    typeInput.placeholder = '类型';
    typeInput.value = Var[index].type || '';
    typeInput.dataset.field = 'type'; // 标记字段类型
    div.appendChild(typeInput);

    // 创建显示初始化的输入框
    const initInput = document.createElement('input');
    initInput.type = 'text';
    initInput.className = 'variety_input';
    initInput.placeholder = '初始化';
    initInput.value = Var[index].value || '';
    initInput.dataset.field = 'value'; // 标记字段类型
    div.appendChild(initInput);

    // 创建删除按钮
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '×';
    deleteBtn.style.position = 'absolute';
    deleteBtn.style.top = '5px';
    deleteBtn.style.right = '5px';
    deleteBtn.dataset.index = index; // 存储数组索引
    bindInputEvents(Var);
    div.appendChild(deleteBtn);
    container.appendChild(div);
}

// 创建新变量
function createValue() {
    // 添加点击事件监听器以创建新的 div
    btn.addEventListener('click', () => {
        // 创建新的变量对象并添加到数组
        const newVar = {
            id: Var.length + 1,
            name: '',
            type: '',
            value: ''
        };
        Var.push(newVar);

        // 创建对应的UI元素
        createVariableBox(Var, Var.length - 1);

        // 重新绑定所有输入框的事件监听器
        bindInputEvents(Var);
        console.log("长度：" + Var.length);
        console.log(Var);
    });
}
/*
// 删除变量
function deleteVariable(Var) {
    // 使用事件委托处理删除按钮点击
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);

            // 1. 先修改数组
            console.log("删除前长度：" + Var.length);
            console.log(Var);
            Var.splice(index, 1);
            console.log("删除后长度：" + Var.length);
            console.log(Var);

            // 2. 从DOM中删除对应的元素
            const boxToRemove = e.target.closest('.variety_box');
            // console.log(boxToRemove);
            container.removeChild(boxToRemove);

            // 3. 更新剩余元素的data-index和编号
            updateVariableBoxesIndex(Var);
            //InitVar(Var);
            // 4. 重新绑定所有输入框的事件监听器
            bindInputEvents(Var);
        }
    });
}
*/
function deleteVariable() {
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            console.log('删除变量，索引：' + index);
            console.log("删除前长度：" + Var.length);
            console.log(Var);
            Var.splice(index, 1); // 修改数组
            console.log("删除后长度：" + Var.length);
            console.log(Var);
            e.target.closest('.variety_box').remove(); // 删除 DOM
            updateVariableBoxesIndex(); // 重新索引
            bindInputEvents(); // 重新绑定事件
        }
    });
}

/*
// 更新所有变量框的索引
function updateVariableBoxesIndex(Var) {
    // 更新数组中的ID
    for (let i = 0; i < Var.length; i++) {
        Var[i].id = i + 1;
    }
    
    // 获取所有变量框
    const boxes = container.querySelectorAll('.variety_box');

    // 更新每个变量框的显示
    boxes.forEach((box, index) => {
        // 更新div的data-index
        box.dataset.index = index;

        // 更新删除按钮的data-index
        const deleteBtn = box.querySelector('.delete-btn');
        deleteBtn.dataset.index = index;

        // 更新编号显示
        let numberDiv = box.querySelector('div');
        console.log(numberDiv);
        numberDiv.textContent = `编号: ${Var[index].id}`;

        // 更新输入框的值
        const inputs = box.querySelectorAll('input');
        inputs[0].value = Var[index].name;
        inputs[1].value = Var[index].type;
        inputs[2].value = Var[index].value;
    });
}
*/
function updateVariableBoxesIndex() {
    // 更新数组中的ID
    for (let i = 0; i < Var.length; i++) {
        Var[i].id = i + 1;
    }

    // 获取所有变量框（确保数量不超过 Var.length）
    const boxes = container.querySelectorAll('.variety_box');
    console.log('boxes.length:' + boxes.length);
    const loopCount = Math.min(boxes.length, Var.length); // 取较小值

    for (let i = 0; i < loopCount; i++) {
        const box = boxes[i];
        box.dataset.index = i;

        const deleteBtn = box.querySelector('.delete-btn');
        if (deleteBtn) deleteBtn.dataset.index = i;

        const numberDiv = box.querySelector('div');
        if (numberDiv) numberDiv.textContent = `编号: ${Var[i].id}`;

        const inputs = box.querySelectorAll('input');
        if (inputs.length >= 3) {
            inputs[0].value = Var[i].name || '';
            inputs[1].value = Var[i].type || '';
            inputs[2].value = Var[i].value || '';
        }
    }
}


// 绑定所有输入框的事件监听器

function bindInputEvents() {
    // 移除所有现有的输入框事件监听器
    const allInputs = container.querySelectorAll('.variety_input');
    allInputs.forEach(input => {
        // 克隆并替换输入框以移除事件监听器
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
    });



    // 为所有输入框添加新的事件监听器
    const boxes = container.querySelectorAll('.variety_box');
    boxes.forEach((box, index) => {
        const inputs = box.querySelectorAll('.variety_input');

        inputs[0].addEventListener('input', () => {
            Var[index].name = inputs[0].value;
        });

        inputs[1].addEventListener('input', () => {
            Var[index].type = inputs[1].value;
        });

        inputs[2].addEventListener('input', () => {
            Var[index].value = inputs[2].value;
        });
        
        // 绑定删除按钮的点击事件

        const allDeleteBtns = container.querySelectorAll('.delete-btn');
        allDeleteBtns.forEach(deleteBtn => {
            // 克隆并替换删除按钮以移除事件监听器
            const newDeleteBtn = deleteBtn.cloneNode(true);
            deleteBtn.parentNode.replaceChild(newDeleteBtn, deleteBtn);
        });
        
        // 绑定删除按钮的点击事件
        // 注意：这里的事件监听器必须在绑定输入框事件监听器之后，否则会导致事件冒泡，导致点击删除按钮时，输入框的事件也被触发
        // 因此，必须在最后一步绑定删除按钮的事件监听器
    });
}

//清除全部变量框
//清除所有variety_box元素
function clearAllBox() {
    const boxes = container.querySelectorAll('.variety_box');
    boxes.forEach(box => {
        container.removeChild(box);
    });
}

function clearAll(Var) {
    clearAllBox();
    Var.length = 0;
}

// 初始化时绑定事件监听器


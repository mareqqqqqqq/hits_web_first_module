function getVaruableBlockValue(blockId) {
    const block = document.getElementById(blockId); 
    if (!block) return null; 

    const input_value = block.querySelector('div[contenteditable="true"]'); 
    if (input_value) {
        if (input_value.textContent.trim() != "Переменная")
        return input_value.textContent.trim(); 

        else {
            return null;
        }
    }

    return null; 
}

function getAssignmentBlockValue(blockId) {
    const block = document.getElementById(blockId); 
    if (!block) return null; 

    const input_value = block.querySelector('div[contenteditable="true"]');
    if (input_value) {
        if (input_value.textContent.trim() != "Присвоить:") 
            return input_value.textContent.trim();
        else { 
            return 0; 
        }
    }

    return null;
}

function getIfBlockValue(block_id) {
    const block = document.getElementById(block_id); 
    if (!block) return null;

    // получаем обььект с этими кака их формами
    const foreign_objects = block.querySelectorAll('foreignObject');

    // в функцию и будем передать формы из обьекта, в нём как в масисве 
    function GetForeignObjectsValue(foreign_object) {
        // одна из кентов будет скрыта 
        let select = foreign_object.querySelector('select'); 
        let input = foreign_object.querySelector('input');

        // если есть селект 
        if (select && select.style.display !== "none") {
            // console.log("считано селект форма");
            return select.value; 
        }

        else if (input && input.style.display !== "none") {
            // console.log("считано инпут форма");
            return input.value;
        }
    }

    let operatorSelect = foreign_objects[1].querySelector('select');
    let operator = operatorSelect ? operatorSelect.value : null; 

    
    let left_num_form_value = GetForeignObjectsValue(foreign_objects[0]);
    let right_num_form_value = GetForeignObjectsValue(foreign_objects[2]);

    return {
        left: left_num_form_value, 
        operator:  operator, 
        right: right_num_form_value
    }
}

function getOutputBlockValue(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return; 
    
    const foreign_objects = block.querySelectorAll('foreignObject'); 

    function GetForeignObjectsValue(foreign_object) {
        let select = foreign_object.querySelector('select');
        let input = foreign_object.querySelector('input');

        if (select && select.style.display !== "none") {
            return select.value; 
        }

        else if (input && input.style.display !== "none") { 
            return input.value;             
        }
    }

    let data_from_form = GetForeignObjectsValue(foreign_objects[0]); 
    return data_from_form; 
}

function getArifBlockValue(block_id) {
    const block = document.getElementById(block_id); 
    if (!block) return null;

    // получаем обььект с этими кака их формами
    const foreign_objects = block.querySelectorAll('foreignObject');
    
    // в функцию и будем передать формы из обьекта, в нём как в масисве 
    function GetForeignObjectsValue(foreign_object) {
        // одна из кентов будет скрыта 
        let select = foreign_object.querySelector('select'); 
        let input = foreign_object.querySelector('input');

        // если есть селект 
        if (select && select.style.display !== "none") {
            // console.log("считано селект форма");
            return select.value; 
        }

        else if (input && input.style.display !== "none") {
            // console.log("считано инпут форма");
            return input.value;
        }
    }

    let varuable_name; 
    let left; 
    let right; 


    let raw_left = GetForeignObjectsValue((foreign_objects[1]));
    let raw_right = GetForeignObjectsValue((foreign_objects[3]));

    if (checkIsArray(raw_left)) {
        left = Number(checkIsArray(raw_left));
    }

    else {
        left = Number(GetForeignObjectsValue((foreign_objects[1])));
    }

    if (checkIsArray(raw_right)) {
        right = checkIsArray(raw_right);
    }

    else {
        right = Number(GetForeignObjectsValue((foreign_objects[3])));
    }
    


    varuable_name = GetForeignObjectsValue(foreign_objects[0]);
    left = GetForeignObjectsValue((foreign_objects[1])); 
    right =  GetForeignObjectsValue((foreign_objects[3]));

    let operatorSelect = foreign_objects[2].querySelector('select');
    let operator = operatorSelect ? operatorSelect.value : null; 

    return {
        varuable_name: varuable_name, 
        left: left, 
        operator:  operator, 
        right: right 
    }
}

function getArrayBlockValue(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;
    
    const inputs = block.querySelectorAll("input");

    const name = inputs[0]?.value.trim() || "";
    const length = parseInt(inputs[1]?.value) || 0;

    const elementsRaw = inputs[2]?.value.trim() || "";

    const elements = elementsRaw
        .split(" ")
        .filter(v => v !== "")
        .map(v => parseInt(v));

        return {
            array_name: name,
            array_length: length,
            array_elements: elements
        };
}

function getArrayIndexValue(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;
    
    const foreign_objects = block.querySelectorAll('foreignObject');

    function getInputValue(foreign_object) {
         if (!foreign_object) {
            return null; 
        }

        let select = foreign_object.querySelector('select'); 
        let input = foreign_object.querySelector('input');

        if (select && select.style.display !== "none") {
            if (!select.value) {
                console.log("не найдено значение для выбора")
                return null; 
            }
            return select.value || null; 
        }

        else if (input && input.style.display !== "none") {
            if (!input.value) {
                console.log("не найдено значение ввода")
                return null;
            }
            return input.value || null;
        }

        console.log("не найдено значение ни выбора ни ввода ");
        return null; 
    } 

    const array_name = getInputValue(foreign_objects[0]);
    const array_index = getInputValue(foreign_objects[1]); 

    return {
        array_name: array_name, 
        array_index: array_index, 
    }
}

function getForCycleValue(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return null; 
    
    const foreign_objects = block.querySelectorAll('foreignObject');

    //console.log(foreign_objects);

    function getInputValue(foreign_object) {
        if (!foreign_object) {
            console.log("foreign_object не найден")
            return null; 
        }

        let select = foreign_object.querySelector('select'); 
        let input = foreign_object.querySelector('input');

        if (select && select.style.display !== "none") {
            if (!select.value) {
                console.log("не найдено значение для выбора")
                return null; 
            }
            return select.value || null; 
        }

        else if (input && input.style.display !== "none") {
            if (!input.value) {
                console.log("не найдено значение ввода")
                return null;
            }
            return input.value || null;
        }

        console.log("не найдено значение ни выбора ни ввода ");
        return null; 
    }

    let cycle_varuable = getInputValue(foreign_objects[0]);
    let cycle_start_value = getInputValue(foreign_objects[1]);
    let cycle_varuable_start = getInputValue(foreign_objects[2]);
    let cycle_operator_select = getInputValue(foreign_objects[3]);
    let cycle_varuable_stop = getInputValue(foreign_objects[4]); 
    let cycle_step_sign = getInputValue(foreign_objects[5]);
    let cycle_step_value = getInputValue(foreign_objects[6]); 

    return {
        cycle_varuable: cycle_varuable, 
        cycle_start_value: cycle_start_value, 
        cycle_varuable_start: cycle_varuable_start, 
        cycle_operator_select: cycle_operator_select, 
        cycle_varuable_stop: cycle_varuable_stop, 
        cycle_step_sign: cycle_step_sign, 
        cycle_step_value: cycle_step_value
    }
}

function getWhileBlockData(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return null; 

    const foreign_objects = block.querySelectorAll('foreignObject');
    
    function getBlockValue(foreign_object) {
        let select = foreign_object.querySelector('select'); 
        let input = foreign_object.querySelector('input');

        if (select && select.style.display !== "none") {
            return select.value; 
        }

        else if (input && input.style.display !== "none") {
            return input.value;
        }
        return null;
    }

    let left = getBlockValue(foreign_objects[0]);
    let operator = getBlockValue(foreign_objects[1]); 
    let right = getBlockValue(foreign_objects[2]);
    
    return {
        left: left, 
        operator: operator, 
        right: right 
    }
}

function checkIsArray(str) {
    if (str === null || str === undefined) {
        console.log("вы ничего не ввели в какой то блок");
        return null;
    }

    str = String(str).trim(); 

    const match = str.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(.+)\]$/);

    // если это не введённое назвение не корректтное то null
    if (!match) {
        return null; 
    }

    let array_name = match[1];
    let array_index = match[2]; 

    let index;

    // пытаемся найти перменную с таким именем
    if (isNaN(array_index)) {
        let found_varuable = varuable_list.find(varuable =>
            varuable.varuable_name === array_index
        );

        // если не нашли то кидаем ошибку 
        if (!found_varuable) {
            console.log("вы пытаетесь обратиться к элементу массива с помощью несущ перменной");
            return null;
        }

        index = found_varuable.varuable_value; 
    }

    else {
        index = Number(array_index);
    }

    // крч индекс это либо значение переменной, либо значение просто число которое пользователь ввёл 

    
    let found_array = ArrayName.find(array => 
        array.array_name === array_name
    );

    if (!found_array) {
        console.log("массив не найден");
        return null; 
    }

    let array_elements = found_array.array_elements; 

    if (index < 0 ||  index > Number(found_array.array_length)) {
        console.log("вы обратились к несуществующему индексу")
        return null;
    }

    console.log(array_elements); 
    console.log(index);
    console.log(found_array.array_elements[index]);
    console.log(array_name);


    let result =  {
        array_elements: array_elements, 
        array_index: index,
        array_name: array_name,
        array_element_value: found_array.array_elements[index]
    };

    console.log("ФИНАЛЬНЫЙ ОБЬЕКТ", result)
    return result;
}

window.script = this;



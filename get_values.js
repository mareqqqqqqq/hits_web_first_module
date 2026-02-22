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

    let left = GetForeignObjectsValue((foreign_objects[0])); 
    let right =  GetForeignObjectsValue((foreign_objects[2]));

    let operatorSelect = foreign_objects[1].querySelector('select');
    let operator = operatorSelect ? operatorSelect.value : null; 


    return {
        left: left, 
        operator:  operator, 
        right: right 
    }
}

function getArrayBlockValue(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;
    
    const foreign_objects = block.querySelectorAll('foreignObject');

    function getInputValue(foreign_object) {
        if (!foreign_object) return null;
        const input = foreign_object.querySelector('input');
        return input ? input.value.trim() : null; 
    } 

    const array_length = getInputValue(foreign_objects[0]); 
    const array_elements = getInputValue(foreign_objects[1]);

    let elements = [];
    if (array_elements && array_length) {
        elements = array_elements.split(' ').filter(el => el != ''); 
    }

    return {
        length: array_length, 
        elements: elements,
    }
}

function getForCycleValue(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return null; 
    
    const foreign_objects = block.querySelectorAll('foreignObject');

    console.log(foreign_objects);

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

window.script = this;



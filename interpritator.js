const start_button = document.getElementById('start_button');
const varuable_list = [];

function GetAllVaruables() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
        conn.parent_block_type === "start_block" && conn.child_block_type === "varuable_block");

    console.table(connection_array_element_with_start_block);

    // получили ребёнка 
    let current_varuable_block_id = connection_array_element_with_start_block.child; // айди диктуй 
    let current_varuable_block = document.getElementById(current_varuable_block_id);
    let current_varuable_block_type = current_varuable_block.dataset.data_type; 

    // тут будет цикл wihle пока есть перемнные и есть сын присвоить то выводи

    while (current_varuable_block) {
        const connection_array_current_varuable_block_assignment = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
            conn.parent_block_type === "varuable_block" && conn.child_block_type === "assignment_block" && conn.parent === current_varuable_block_id);

        // проверка на null
        const varuable_assignment_block_id = connection_array_current_varuable_block_assignment ? connection_array_current_varuable_block_assignment.child :  null; 
        
        // защита от дурака(прилепил не туда(потом пофильруем по переменным если что кинем invalid))
        varuable_list.push({
            block_id: current_varuable_block.id,
            block_type: current_varuable_block.dataset.data_type, 
            varuable_name: getVaruableBlockValue(current_varuable_block_id), 
            varuable_value: getAssignmentBlockValue(varuable_assignment_block_id) 
        })

        // получили next блок хранится как сам блок
        const next_conn = connections.find(conn =>  // получили connection запись где у нас cuurent блок - отец, а тип его сына - varuable
            conn.parent === current_varuable_block.id && conn.child_block_type === "varuable_block"
        )

        if (next_conn) {
            current_varuable_block_id = next_conn.child; // айди диктуй
            current_varuable_block = document.getElementById(current_varuable_block_id);
            current_varuable_block_type = current_varuable_block.dataset.data_type; 
        }

        else {
            current_varuable_block = null;
        }
    }


    console.table(connections);
    console.table(varuable_list);
}

function HandleAnyBlock(block_type) {
    switch (block_type) {
        case "if_block":
            HandleIfBlock(block_id);

        case "then_block": 
            HandleThenBlock(block_id);

        case "else_block": 
            HandleElseBlock(block_id);

        case "cycle_block": 
            HandleCycleBlock(block_id);

        case "output_block": 
            HandleOutputBlock(block_id);

        case "arif_block": 
            HandleOutputBlock(block_id);

        case "varuable_blcok": 
            HandleVaruableBlock(block_id);

        case "assignment_block": 
            HandleAssignmentBlock(block_id);

        case "arif_block": 
            HandleArifBlock(block_id); 
    }
}



function LeftPartOfCodeBlock() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
            conn.parent_block_type === "start_block" && conn.child_block_type !== "varuable_block");

    if (!connection_array_element_with_start_block) return; 

    let block_id = connection_array_element_with_start_block.child; 
    let block = document.getElementById(block_id);
    let block_type = block.dataset.data_type;

    console.log(block_id); 
    console.log(block_type);
    
    const allowed_blocks = ["if_block", "output_block", "arif_block", "cycle_block"]; 

    if (allowed_blocks.includes(block_type)) {
        switch (block_type) {

            case "if_block":
                let result = HandleIfBlock(block_id);

                if (result == true) {
                    // нашли current соединение с нашим блоком
                    const find_next_block = connections.find(conn => // тут отец if а его сын какой то блок   
                        conn.parent_block_type === "if_block" && conn.parent === block_id);

                    let next_block_id = find_next_block.child;
                    let next_block_type = find_next_block.child_block_type; 
                    let next_block = document.getElementById(next_block_id);

                    console.table(find_next_block); 
                    console.log(next_block_type); 

                    HandleAnyBlock(next_block_id); 
                }

                // надо проскакать до else и обрабатывать его, если его нет то дальше скачем то что после явл сыно then блока 
                else {
                    
                }

                





            case "else_block":
                HandleElseBlock(block_id);

            case "then_block":
                HandleThenBlock(block_id);
            case "output_block": 
                HandleOutputBlock(block_id);
        }
    }

    else { 
        InvalidSyntacsisError();
    }
}

function HandleIfBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
        return null; 

    }

    let forms_data = getIfBlockValue(block.id); 

    let operator = forms_data.operator; 
    let right_str = forms_data.right; 
    let left_str = forms_data.left; 

    let bool_result; 

    let right = Number(right_str);
    let left = Number(left_str);

    switch(operator) {
        case ">": bool_result = left > right;
            break; 
        case "<": bool_result = left < right;
            break; 
        case "=": bool_result = left == right;
            break; 
        case "!=": bool_result = left != right;
            break; 
        case ">=": bool_result = left >= right;
            break;  
        case "<=": bool_result = left <= right;
            break; 
    }

    console.log(bool_result);
    return bool_result; 
}

function HandleElseBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleThenBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleOutputBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleVaruableBlock(block_id) {

}

function HandleAssignmentBlock(block_id){

}

function HandleArifBlock(block_id) {

}








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






start_button.addEventListener('click', e => {
    varuable_list.length = 0;
    GetAllVaruables(); 
    LeftPartOfCodeBlock()
})

window.script = this; 


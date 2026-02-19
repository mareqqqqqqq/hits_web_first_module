const start_button = document.getElementById('start_button');
const varuable_list = [];

function getAllVaruableName() {
    return varuable_list
    .map(v => v.varuable_name)
    .filter(name => name && name.trim() !== "");
}

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

function LeftPartOfCodeBlock() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
            conn.parent_block_type === "start_block" && conn.child_block_type !== "varuable_block");

    if (!connection_array_element_with_start_block) return; 

    let block_id = connection_array_element_with_start_block.child; 
    let block = document.getElementById(block_id);
    let block_type = block.dataset.data_type;
    
    const allowed_blocks = ["if_block", "output_block"]; 

    if (allowed_blocks.includes(block_type))
    switch (block_type) {
        case "if_block":
            HandleIfBlock(block_id); 

        case "else_block":
            break;

        case "then_block":
            break; 

        case "output_block": 
            break;
    }

    else { 

    }
}

function HandleIfBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleElseBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleThenBlockBlock(block_id) {
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
    const block = document.getElementById(blockId); 
    if (!block) return null;

    const foreignObjects = block.querySelectorAll('foreignObject'); 

    


}

start_button.addEventListener('click', e => {
    varuable_list.length = 0;
    GetAllVaruables(); 
})

window.script = this; 


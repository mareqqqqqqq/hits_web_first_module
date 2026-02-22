const start_button = document.getElementById('start_button');
const varuable_list = [];
let ArrayName = [];

// получает имена переменных для выпадающей менюшки 
function getAllVaruableName() {
    return varuable_list
    .map(v => v.varuable_name)
    .filter(name => name && name.trim() !== "");
}

function GetAllVaruables() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
        conn.parent_block_type === "start_block" && conn.child_block_type === "varuable_block");

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
}

function GetAllArrays() {
    ArrayName = [];
    let array_blocks = document.querySelectorAll('[data-data_type="array_block"]');
    
    array_blocks.forEach(block => {
        let array_id = block.id;
        let array_data = getArrayBlockValue(array_id);


        if (array_data && array_data.name) {
            ArrayName.push ({
                array_name: array_data.name,
                array_id: array_id
            });
        }
    });

    return;
} 


function HandleAnyBlock(block_type, block_id) {
    switch (block_type) {
        case "if_block":
            HandleIfBlock(block_id);
            break;

        case "cycle_block": 
            HandleCycleBlock(block_id);
            break;

        case "output_block": 
            HandleOutputBlock(block_id);
            break;

        case "varuable_block": 
            HandleVaruableBlock(block_id);
            break;

        case "assignment_block": 
            HandleAssignmentBlock(block_id);
            break;

        case "arif_block": 
            HandleArifBlock(block_id);
            break; 

        case "cycle_while_block":
            HandleCycleWhileBlock();
            break; 

        case "cycle_for_blcok":
            HandleCycleForBlock(); 
            break; 

        case "array_block": 
            HandleArrayBlock(); 
            break; 
    }
}

function LeftPartOfCodeBlock() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
            conn.parent_block_type === "start_block" && conn.child_block_type !== "varuable_block");

    if (!connection_array_element_with_start_block) return; 

    // получаем next блок
    let block_id = connection_array_element_with_start_block.child; 
    let block = document.getElementById(block_id);
    let block_type = block.dataset.data_type;
    
    const allowed_blocks = ["if_block", "output_block", "arif_block", "cycle_for_block", "cycle_while_block", "array_block", "varuable_block"]; 

    switch (block_type) {
        case "if_block":
            HandleIfBlock(block_id);
            break; 

        case "output_block":
            HandleOutputBlock(block_id); 
            break
            
        case "arif_block":
            HandleArifBlock(block_id);
            break; 

        case "cycle_block":
            HandleCycleBlock(block_id);
            break;

        case "array_block":
            HandleArrayBlock(block_id);
            break; 

        case "varuable_block": 
            HandleVaruableBlock(block_id);
            break; 

        case "arif_block":
            HandleArifBlock(block_id);
            break;  

        case "cycle_for_block": 
            HandleCycleForBlock(block_id);
            break; 

        case "cycle_while_block":
            HandleWhileBlock(block_id);
            break;
        }
}

start_button.addEventListener('click', e => {
    varuable_list.length = 0;
    GetAllVaruables(); 
    LeftPartOfCodeBlock();
})

window.script = this;

const start_button = document.getElementById('start_button');
let varuable_list = [];
let ArrayName = [];

function updateVaruable(block_id, name) {

    const existing = varuable_list.find(v => v.block_id === block_id);

    if (existing) {
        existing.varuable_name = name;
    }
    else {
        varuable_list.push({
            block_id: block_id,
            block_type: "varuable_block",
            varuable_name: name,
            varuable_value: null
        });
    }
    refreshAllVariableSelectors();
}

function updateVaruableValue(block_id, value) {
    const existing = varuable_list.find(v => v.block_id === block_id);

    if (existing) {
        existing.varuable_value = value;
    }
}

// получает имена переменных для выпадающей менюшки 
function getAllVaruableName() {
    return varuable_list
    .map(v => v.varuable_name)
    .filter(name => name && name.trim() !== "");
}

function refreshAllVariableSelectors() {
    document.querySelectorAll("select").forEach(select => {
        if (!select.dataset.varuableSelectors) return;

        const currentValue = select.value;
        select.innerHTML = "";

        const names = getAllVaruableName();

        if (names.length === 0){
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "Нет переменных";
            select.appendChild(option);
        }
        else {
        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });
    }

        const customOption = document.createElement("option");
        customOption.value = "custom";
        customOption.textContent = "Другое";
        select.appendChild(customOption);

        select.value = currentValue;
    });
}

function GetAllArrays() {
    ArrayName = [];
    let array_blocks = document.querySelectorAll('[data-data_type="array_block"]');
    
    array_blocks.forEach(block => {
        let array_id = block.id;
        let array_data = getArrayBlockValue(array_id);
        let array_elements = array_data.array_elements; 
        let array_length = array_data.array_length; 


        if (array_data && array_data.array_name) {
            ArrayName.push ({
                array_length: array_length, 
                array_name: array_data.array_name,
                array_id: array_id, 
                array_elements: array_elements 
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
            HandleCycleWhileBlock(block_id);
            break; 

        case "cycle_for_block":
            HandleCycleForBlock(block_id); 
            break; 

        case "array_block": 
            HandleArrayBlock(block_id); 
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
    
    const allowed_blocks = ["if_block", "output_block", "arif_block", "cycle_for_block", "cycle_while_block", "array_block", "varuable_block", "array_index_block"]; 

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

        case "array_index_block": 
            HandleArrayIndexBlock(block_id);
            break; 
        }

        

}

start_button.addEventListener('click', e => {
    LeftPartOfCodeBlock();
})

window.script = this;

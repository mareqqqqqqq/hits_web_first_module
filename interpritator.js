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
            varuable_value: null,
            initial_value
        }); 
    }
    refreshAllVariableSelectors();
}

function updateVaruableValue(block_id, value) {
    const existing = varuable_list.find(v => v.block_id === block_id);

    if (existing) {
        existing.initial_value = parseInt(value) || 0;
        existing.varuable_value = parseInt(value) || 0;
    }
}

// получает имена переменных для выпадающей менюшки 
function getAllVaruableName() {
    const variables = varuable_list
    .map(v => v.varuable_name)
    .filter(name => name && name.trim() !== "");

    const arrays = ArrayName
        .map(a => a.array_name)
        .filter(name => name && name.trim() !== "");

    return [...variables, ...arrays];
}

function refreshAllVariableSelectors() {
    document.querySelectorAll("select").forEach(select => {
        
        const currentValue = select.value;
        select.innerHTML = "";

        const names = getAllVaruableName();

        if (names.length === 0) {
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

        if (select.dataset.varuableSelectors === "true") {
            const customOption = document.createElement("option");
            customOption.value = "custom";
            customOption.textContent = "Другое";
            select.appendChild(customOption);
        }
        select.value = currentValue;
    });
}

function resetAllVariables() {
    varuable_list.forEach( v => {
        v.varuable_value = v.initial_value ?? 0;
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

function updateArray(block_id) {
    const data = getArrayBlockValue(block_id);
    if (!data) return;

    const existing = ArrayName.find(a => a.array_id === block_id);

    if (existing) {
        existing.array_name = data.array_name;
        existing.array_length = data.array_length;
        existing.array_elements = data.array_elements;
    }
    else {
        ArrayName.push({
            array_id: block_id,
            array_name: data.array_name,
            array_length: data.array_length,
            array_elements: data.array_elements
        });
    }
    refreshAllVariableSelectors();
}

function HandleAnyBlock(block_type, block_id) {
    switch (block_type) {
        case "if_block":
            return HandleIfBlock(block_id);

        case "output_block": 
            return HandleOutputBlock(block_id);
            

        case "varuable_block": 
            return HandleVaruableBlock(block_id);

        case "assignment_block": 
            return HandleAssignmentBlock(block_id);

        case "arif_block": 
            return HandleArifBlock(block_id);

        case "cycle_while_block":
            return HandleCycleWhileBlock(block_id);

        case "cycle_for_block":
            return HandleCycleForBlock(block_id); 

        case "array_block": 
            return HandleArrayBlock(block_id); 
    }
}

function LeftPartOfCodeBlock() {
    const connection_array_element_with_start_block = connections.find(conn => // нашли соеденение где старт где: родитель - старт, а сын - переменная  
            conn.parent_block_type === "start_block" && conn.child_block_type !== "varuable_block");

    if (!connection_array_element_with_start_block) return; 

    // получаем next блок
    let block_id = connection_array_element_with_start_block.child; 
    
    while (block_id) {
        let block = document.getElementById(block_id);
        if (!block) break;

        let block_type = block.dataset.data_type;

        block_id = HandleAnyBlock(block_type, block_id);
    }  
}

start_button.addEventListener('click', e => {
    resetAllVariables();
    GetAllArrays();
    LeftPartOfCodeBlock();
})

window.script = this;

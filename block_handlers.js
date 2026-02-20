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

function HandleEndIfBlock(block_id) {

}

function HandleElseBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
    }

    return null; 
}

function HandleEndElseBlock(block_id) {

}

function HandleOutputBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) {
        InvalidSyntacsisError();
    }

    let output = getOutputBlockValue(block.id); 

    if (output) {
        console.log(output)
        // return output;
    }

    else {
        console.log("вы ничего не ввели в output блок")
        return; 
    }

    return null; 
}

function HandleVaruableBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) {
        console.log("Блок переменной не найден")
        return;
    }

    let block_type = block.dataset.block_type;  

    let current_varuable_connection = connections.find(conn => 
        conn.child_block_type === "varuable_block" && conn.child === block_id);

    let current_varuable_name = getVaruableBlockValue(block_id);
    


    // соедиенение где присваивание блок 
    let current_assignment_connection = connections.find(conn => 
        conn.parent === block_id && conn.child_block_type === "assignment_block" && conn.parrent_block_type === "assignment_block"
    );

    let current_assignment_block_id = current_assignment_connection ? current_assignment_connection.child : null; 
    let current_assignment_blcok_type = current_assignment_connection ? current_assignment_connection.child_block_type : null; 
    let current_varuable_block_value = current_assignment_connection ?  getAssignmentBlockValue(block_id) : null; 

    // тут надо будет записывать в масисив varuable_list(пока лень)
    // записываем в varuable_list

    varuable_list.push({
        vatuable_block_id: block_id,
        varuable_block_type: block_type,
        varuable_name: current_varuable_name, 
        varuable_value: current_varuable_block_value, 
        assignment_value: current_assignment_blcok_id,
        assignment_type: current_assignment_blcok_type 
    })
}

function HandleArifBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return; 

    let arif_block_input = getArifBlockValue(block_id);

    console.log(arif_block_input);

    let left = Number(arif_block_input.left);  
    let right  = Number(arif_block_input.right); 

    console.log(right);
    console.log(left);
    
    let operator = arif_block_input.operator;

    console.log(operator);

    let arif_result; 

    if (arif_block_input.operator) {
        switch (operator) {
            case "+": arif_result = right + left;
                break; 
            case "-": arif_result = right - left;
                break; 
            case "*": arif_result = right * left;
                break; 
            case "//": arif_result = right / left
                break; 
            case "%": arif_result = right % left
                break;
        }
    }

    console.log(arif_result); 
    return arif_result; 
}

function HandleArrayBlock(block_id) {

}

function HandleCycleBlock(block_id) {

}



window.script = this; 
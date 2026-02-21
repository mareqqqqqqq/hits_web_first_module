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

    let next_block_id; 
    let next_block_type; 
    let next_block;

    let find_current_connection_with_if; 
    let find_curent_connection; 

    if (bool_result == true) {
        // соединение с if блоком 
        find_current_connection_with_if = connections.find(conn =>    
            conn.parent_block_type === "if_block" && conn.parent === block_id); // block_id эт айдишка if блока нашли это соеднение 

        // просто находим нект блок который после if
        if (find_current_connection_with_if) {
            next_block_id = find_current_connection_with_if.child; // это будет блок котоырый сын if
            next_block_type = find_current_connection_with_if.child_block_type; // тип сына 
            next_block = document.getElementById(next_block_id); // сам блок как обьект 
        }

        // если нет соединения
        else {
            InvalidSyntacsisError();
            console.log("вы не добавили блоки после if");
            return;
        }

        // по идее пока есть next блок мы его обрабатываем и находим next 
        while (next_block_type) {
            // если дошли до конца if 
            if (next_block_type == "endif_block") {
                break;
            }

            else {
                HandleAnyBlock(next_block_type, next_block_id);

                // нашли соеденения где родитель наш next блок 
                let find_current_connection = connections.find(conn => 
                    conn.parent_block_type === next_block_type && conn.parent === next_block_id);

                if (find_current_connection) {
                    next_block_id = find_current_connection.child;
                    next_block_type = find_current_connection.child_block_type; 
                    next_block = document.getElementById(next_block_id);
                }

                else {
                    InvalidSyntacsisError();
                    break; 
                }
            }
        }
    }

    else if (bool_result == false) {
        // соединение с if для спуска по дереву до else 
        find_current_connection = connections.find(conn =>    
            conn.parent_block_type === "if_block" && conn.parent === block_id); // у нас всё рабно block_id будет if_block потому что мы не попадаем никак в if если попали в else
                
        let end_if_child_connection = DownTheTree(block_id, "if_block", "endif_block");

        // console.log(end_if_connection);

        let next_block_id = end_if_child_connection.child; 
        let next_block = document.getElementById(next_block_id);
        let next_block_type = next_block.dataset.data_type; 

        // сама обрааботка того что внутри
        while (next_block_type) {
            if (next_block_type == "endelse_block") {
                break;
            }

            else {
                HandleAnyBlock(next_block_type, next_block_id);

                // надо добавить проверку типов 
                find_current_connection_with_if = connections.find(conn => // тут отец if а его сын какой то блок   
                    conn.parent_block_type === next_block_type && conn.parent === next_block_id);

                if (find_current_connection_with_if) {
                    next_block_id = find_current_connection_with_if.child;
                    next_block_type = find_current_connection_with_if.child_block_type; 
                    next_block = document.getElementById(next_block_id);
                }

                else {
                    InvalidSyntacsisError();
                    break;  
                }
            }
        }
    } 
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


    let left = Number(arif_block_input.left);  
    let right  = Number(arif_block_input.right); 

    let operator = arif_block_input.operator;

    let arif_result; 

    if (arif_block_input.operator) {
        switch (operator) {
            case "+": arif_result = left + right;
                break; 
            case "-": arif_result = left - right;
                break; 
            case "*": arif_result = left * right;
                break; 
            case "//": arif_result = left / right;
                break; 
            case "%": arif_result = left % right;
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
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
            console.log("вы не добавили блоки после if");
            InvalidSyntacsisError();
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
        // стартовое 
        let current_connection = connections.find(conn => 
            conn.parent_block_type === "if_block" && conn.parent === block_id
        );

        // если есть что то после if 
        if (!current_connection) {
            InvalidSyntacsisError(); 
            return null; 
        }

        next_block_id = current_connection.child; 
        next_block_type = current_connection.child_block_type; 


        while (next_block_id && next_block_type !== "endif_block") {
            current_connection = connections.find(conn => 
                conn.parent === next_block_id && conn.parent_block_type === next_block_type
            );
            
            if (current_connection) {
                next_block_id = current_connection.child; 
                next_block_type = current_connection.child_block_type;
            }

            else {
                break;
            }    
        }

        if (next_block_type !== "endif_block") {
            InvalidSyntacsisError();
            return null; 
        }

        let else_connection = connections.find(conn => 
            conn.parent === next_block_id && conn.parent_block_type === next_block_type
        );

        if (!else_connection) {
            InvalidSyntacsisError(); 
            return null;
        }

        let else_block_id = else_connection.child;
        let else_block = document.getElementById(else_block_id);
        let else_block_type = else_block.dataset.data_type;

        // обрабатываем else ветку до endelse_block
        while (else_block_id && else_block_type !== "endelse_block") {
            // обрабатываем текущий блок в else ветке
            HandleAnyBlock(else_block_type, else_block_id);

            // ищем следующий блок в else ветке
            let next_else_connection = connections.find(conn => 
                conn.parent === else_block_id && conn.parent_block_type === else_block_type
            );

            if (next_else_connection) {
                else_block_id = next_else_connection.child;
                else_block = document.getElementById(else_block_id);
                else_block_type = else_block.dataset.data_type;
            } else {
                break;
            }
        }

        // возвращаем следующий блок после всей if-else конструкции
        let next_after_else = connections.find(conn => 
            conn.parent === else_block_id && conn.parent_block_type === else_block_type
        );

        return next_after_else ? next_after_else.child : null;
    } 
}

function HandleElseBlock(block_id) {
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
        conn.parent === block_id && conn.child_block_type === "assignment_block" && conn.parent_block_type === "assignment_block"
    );

    let current_assignment_block_id = current_assignment_connection ? current_assignment_connection.child : null; 
    let current_assignment_blcok_type = current_assignment_connection ? current_assignment_connection.child_block_type : null; 
    let current_varuable_block_value = current_assignment_connection ?  getAssignmentBlockValue(block_id) : null; 

    // тут надо будет записывать в масисив varuable_list(пока лень)
    // записываем в varuable_list

    varuable_list.push({
        varuable_block_id: block_id,
        varuable_block_type: block_type,
        varuable_name: current_varuable_name, 
        varuable_value: current_varuable_block_value, 
        assignment_value: current_assignment_block_id,
        assignment_type: current_assignment_block_type 
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
    let block = document.getElementById(block_id);
    if (!block) return;

    const array_data = getArrayBlockValue(block_id);

    if (!array_data) {
        console.log("ошибка ввода значений массива");
    }

    console.log(array_data.elements);
}

function HandleCycleForBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return null; 

    let for_cycle_data = getForCycleValue(block_id); 

    if (!for_cycle_data) {
        console.log("значения в for не найдены");
    }

    console.log(for_cycle_data.cycle_varuable);
    console.log(for_cycle_data.cycle_start_value);
    console.log(for_cycle_data.cycle_varuable_start);
    console.log(for_cycle_data.cycle_operator_select);
    console.log(for_cycle_data.cycle_varuable_stop);
    console.log(for_cycle_data.cycle_step_sign);
    console.log(for_cycle_data.cycle_step_value);
}

function HandleWhileBlock(block_id ) {
    let block = document.getElementById(block_id); 
    if (!block) return null; 

    let while_block_data = getWhileBlockData(block_id);

    if (!while_block_data) {
        return;
    }

    console.log(while_block_data.left); 
    console.log(while_block_data.operator); 
    console.log(while_block_data.right);  
}



window.script = this; 
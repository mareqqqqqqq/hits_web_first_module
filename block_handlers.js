function HandleIfBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) {
        InvalidSyntacsisError();
        return null; 
    }

    let forms_data = getIfBlockValue(block.id);

    if (!forms_data) {
        console.log("вы ничего не ввели");
    }

    let left = evaluateExpression(forms_data.left);
    let right = evaluateExpression(forms_data.right);

    if (left === null || right === null) {
        InvalidSyntacsisError(); 
        return null;
    }

    let operator = forms_data.operator; 
    let bool_result; 

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

    let find_horizontal_and_connection_with_if = connections.find(conn => 
        conn.parent === block_id && conn.position === "horizontal" && conn.child_block_type === "logic_and_block"
    );

    if (find_horizontal_and_connection_with_if) {
        let result = HandeAndBlock(find_horizontal_and_connection_with_if.child);
        bool_result = bool_result && result;
    }

    let next_block_id; 
    let next_block_type; 
    let next_block;

    let find_current_connection_with_if; 


    if (bool_result == true) {
        // соединение с if блоком 
        find_current_connection_with_if = connections.find(conn =>    
            conn.parent_block_type === "if_block" && conn.parent === block_id && conn.position === "vertical"); // block_id эт айдишка if блока нашли это соеднение 

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

        let endif_block_id; 

        // по идее пока есть next блок мы его обрабатываем и находим next 
        while (next_block_type) {
            // если дошли до конца if 
            if (next_block_type == "endif_block") {
                endif_block_id = next_block_id;  
                break; // стоп обработки конструкции 
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

        let find_after_endif_connection = connections.find(conn => 
            conn.parent_block_type === "endif_block" && conn.parent === endif_block_id
        );

        if (!find_after_endif_connection) return null;

        let skip_block_id = find_after_endif_connection.child; 
        let skip_block = document.getElementById(skip_block_id);
        let skip_block_type = skip_block ? skip_block.dataset.data_type : null;

        if (skip_block_type !== "else_block" && skip_block_type !== "endelse_block") {
            return skip_block_id;
        }
        
        while (skip_block_id && skip_block_type !== "endelse_block") {
            let find_skip_connection = connections.find(conn => 
                conn.parent === skip_block_id && conn.parent_block_type === skip_block_type
            );

            if (!find_skip_connection) break;
            skip_block_id = find_skip_connection.child; 
            skip_block = document.getElementById(skip_block_id);
            skip_block_type = skip_block ? skip_block.dataset.data_type : null;
        } 

        if (skip_block_type === "endelse_block") {
            let find_after_endelse_connection = connections.find(conn => 
                conn.parent === skip_block_id && conn.parent_block_type === "endelse_block"
            );

            return find_after_endelse_connection ? find_after_endelse_connection.child : null;
        }

        return null;
    }

    else if (bool_result == false) {
        // стартовое 
        let current_connection = connections.find(conn => 
            conn.parent_block_type === "if_block" && conn.parent === block_id && conn.position === "vertical"
        );

        // если есть что то после if 
        if (!current_connection) {
            InvalidSyntacsisError(); 
            return null; 
        }

        next_block_id = current_connection.child; 
        next_block_type =
        current_connection.child_block_type; 


        while (next_block_id && next_block_type !== "endif_block") {
            current_connection = connections.find(conn => 
                conn.parent === next_block_id && conn.parent_block_type === next_block_type && conn.position === "vertical"
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
            return null;
        }

        if (else_connection.child_block_type !== "else_block") {
            return else_connection.child;
        }

        let else_block_id = else_connection.child;
        let else_block = document.getElementById(else_block_id);

        if (!else_block) {
            return null;
        }

        let else_block_type = else_block.dataset.data_type;

        let endelse_block_id; 

        // обрабатываем else ветку до endelse_block
        while (else_block_id && else_block_type) {
            if (else_block_type === "endelse_block") {
                endelse_block_id = else_block_id;
                break;
            }
            // обрабатываем текущий блок в else ветке
            HandleAnyBlock(else_block_type, else_block_id);

            // ищем следующий блок в else ветке
            let next_else_connection = connections.find(conn => 
                conn.parent === else_block_id && conn.parent_block_type === else_block_type
            );

            if (!next_else_connection) break;

            else_block_id = next_else_connection.child;
            else_block = document.getElementById(else_block_id);
            else_block_type = else_block.dataset.data_type;
    
            if (!else_block) break;
        }

        if (!endelse_block_id) {
            return connections.find(conn => 
                conn.parent === next_block_id && conn.parent_block_type === "endif_block"
            )?.child || null;
        }

        let next_after_else = connections.find(conn => 
            conn.parent === endelse_block_id && 
            conn.parent_block_type === "endelse_block"
        );

        return next_after_else ? next_after_else.child : null;
    } 
}


function HandleOutputBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) {
        InvalidSyntacsisError();
        return null;
    }

    let output = getOutputBlockValue(block.id); 

    if (!output) {
        console.log("вы ничего не ввели в output блок")
    }

    let found_array = ArrayName.find(arr => 
        arr.array_name === output
    ); 

    if (found_array) {
        console.log(found_array.array_elements);
    }

    else {
        let found_varuable = varuable_list.find(varuable =>
            varuable.varuable_name === output
        );

        if (found_varuable) {
            console.log(found_varuable.varuable_name); 
        }

        else {
            console.log(output);
        }
    }
    
    let connection = connections.find(conn => 
        conn.parent === block_id && conn.parent_block_type === "output_block"
    );

    return connection ? connection.child : null;
}


function HandleVaruableBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) {
        console.log("Блок переменной не найден")
        return;
    }

      
    let next_varuable_connection = connections.find(conn => 
        conn.parent_block_type === "varuable_block" && conn.parent === block_id && conn.position === "vertical");

    return next_varuable_connection ? next_varuable_connection.child : null; 
}


function HandleArifBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return; 

    let arif_block_input = getArifBlockValue(block_id);

    if (!arif_block_input) {
        console.log("что то вы не то ввели");
    }

    let left_varuable_name = arif_block_input.left;
    let left_varuable_value; 

    let check_left_varuable_is_array = checkIsArray(left_varuable_name);
    if (check_left_varuable_is_array) {
        left_varuable_value = Number(check_left_varuable_is_array.array_element_value);
    }

    else {
        let found_left_varuable = varuable_list.find(varuable => 
            varuable.varuable_name === left_varuable_name
        ); 
        
        if (found_left_varuable) {
            left_varuable_value = Number(found_left_varuable.varuable_value);  
        }

        else {
            left_varuable_value = Number(left_varuable_name);
        }
    }

    let right_varuable_name = arif_block_input.right;
    let right_varuable_value; 

    let check_right_varuable_is_array = checkIsArray(right_varuable_name);
    if (check_right_varuable_is_array) {
        right_varuable_value = Number(check_right_varuable_is_array.array_element_value);
    }

    else {
        let found_right_varuable = varuable_list.find(varuable => 
            varuable.varuable_name === right_varuable_name
        ); 
        
        if (found_right_varuable) {
            right_varuable_value = Number(found_right_varuable.varuable_value);  
        }

        else {
            right_varuable_value = Number(right_varuable_name);
        }
    }

    


    let operator = arif_block_input.operator;

    if (!operator) {
        conosle.log("вы не выбрали оператор");
    }

    let arif_result; 

    if (arif_block_input.operator) {
        switch (operator) {
            case "+": arif_result = left_varuable_value + right_varuable_value;
                break; 
            case "-": arif_result = left_varuable_value - right_varuable_value;
                break; 
            case "*": arif_result = left_varuable_value * right_varuable_value;
                break; 
            case "//": arif_result = left_varuable_value / right_varuable_value;
                break; 
            case "%": arif_result = left_varuable_value % right_varuable_value;
                break;
        }
    }

    let main_varuable_name = arif_block_input.varuable_name; 
    let check_main_varuable_is_array = checkIsArray(main_varuable_name);

    if (check_main_varuable_is_array) {
        let array_name = check_main_varuable_is_array.array_name;
        let array_index = check_main_varuable_is_array.array_index; 

        let found_array = ArrayName.find(array => 
            array.array_name === array_name
        );

        if (!found_array) {
            console.log("не получилось обратиться к элементу массива")
            return null;
        }

        found_array.array_elements[array_index] = arif_result;
    }

    else {
        let found_main_varuable = varuable_list.find(varuable => 
            varuable.varuable_name === main_varuable_name
        );

        if (found_main_varuable) {
            found_main_varuable.varuable_value = arif_result;
        }

        else {
            console.log("переменная не найдена")
            return null;
        }
    }

    connection = connections.find(conn => 
        conn.parent === block_id && conn.parent_block_type === "arif_block"
    );

    return connection ? connection.child : null;
}

function HandleArrayBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return;

    const array_data = getArrayBlockValue(block_id);

    if (!array_data) {
        console.log("ошибка ввода значений массива");
    }

    let connection = connections.find(conn => 
        conn.parent === block_id && conn.parent_block_type === "array_block"
    );

    return connection ? connection.child : null;
}


function HandleCycleForBlock(block_id) {
    // получаем блок 
    let block = document.getElementById(block_id);
    if (!block) return null; 

    // знач
    let for_cycle_data = getForCycleValue(block_id); 

    if (!for_cycle_data) {
        console.log("значения в for не найдены");
        return;
    }

    let var_name = for_cycle_data.cycle_varuable;
    let start_value = Number(evaluateExpression(for_cycle_data.cycle_start_value));
    let stop_value = Number(evaluateExpression(for_cycle_data.cycle_varuable_stop));
    let operator = for_cycle_data.cycle_operator_select;
    let step_sign = for_cycle_data.cycle_step_sign;
    let step_value = Number(evaluateExpression(for_cycle_data.cycle_step_value));
    
    let current_value = start_value;


    updateVaruable(block_id, var_name);
    updateVaruableValue(block_id, start_value);

    let first_block_connection = connections.find(conn => 
        conn.parent_block_type === "cycle_for_block" && conn.parent === block_id
    );

    if (!first_block_connection) {
        console.log("Нет блоков в теле цикла for");
        InvalidSyntacsisError();
        return;
    }

    function checkCondition(current, stop, op) {
        switch(op) {
            case ">": return current > stop;
            case "<": return current < stop;
            case "=": return current == stop;
            case "!=": return current != stop;
            case ">=": return current >= stop;
            case "<=": return current <= stop;
            default: return false;
        }
    }

    let iteration_count = 0;
    let max_iterations = 1000;

    while (checkCondition(current_value, stop_value, operator) && iteration_count < max_iterations) {
        iteration_count++;
        
        updateVaruableValue(block_id, current_value);
        
        let current_block_id = first_block_connection.child;
        let current_block_type = first_block_connection.child_block_type;
        
        while (current_block_id) {

            if (current_block_type === "cycle_for_block") {
 
                HandleCycleForBlock(current_block_id);
                
                let nested_endfor = findEndForBlockId(current_block_id);
                if (nested_endfor) {
                   
                    let next_after_nested = connections.find(conn => 
                        conn.parent === nested_endfor && conn.parent_block_type === "endfor_block"
                    );
                    
                    if (next_after_nested) {
                        current_block_id = next_after_nested.child;
                        current_block_type = next_after_nested.child_block_type;
                        continue; 
                    }
                }
            }

            else if (current_block_type === "cycle_while_block")
            {
                HandleCycleWhileBlock(current_block_id);

                let nested_endwhile = findEndWhileBlockId(current_block_id);

                if (nested_endwhile) 
                {
                    let next_after_nested = connections.find(conn => conn.parent === nested_endwhile && conn.parent_block_type === "endwhile_block");

                    if (next_after_nested)
                    {
                        current_block_id = next_after_nested.child;

                        current_block_type = next_after_nested.child_block_type;
                        continue;
                    }
                }
            }

            if (current_block_type === "endfor_block") {

                if (isMyEndForBlock(block_id, current_block_id)) {
                    break; 
                    break; 
                }

                else {

                    let next_connection = connections.find(conn => 
                        conn.parent === current_block_id && conn.parent_block_type === current_block_type
                    );
                    
                    if (next_connection) {
                        current_block_id = next_connection.child;
                        current_block_type = next_connection.child_block_type;
                        continue;
                    } else {
                        break;
                    }
                }
            }

            if (current_block_type !== "cycle_for_block" && current_block_type !== "endfor_block") {
        
            if (current_block_type === "if_block") {
                let next_id = HandleIfBlock(current_block_id);
                if (next_id) {
                    let nb = document.getElementById(next_id);
                    current_block_id   = next_id;
                    current_block_type = nb ? nb.dataset.data_type : null;
                }       
                 else {
                    break;
                }
            continue;
    }

    HandleAnyBlock(current_block_type, current_block_id);
}
            

            let next_connection = connections.find(conn => 
                conn.parent === current_block_id && conn.parent_block_type === current_block_type
            );
            
            if (next_connection) {
                current_block_id = next_connection.child;
                current_block_type = next_connection.child_block_type;
            } else {
                break;
            }
        }


        if (step_sign === "+") {
            current_value += step_value;
            updateVaruableValue(block_id, current_value);
        } 
        else if (step_sign === "-") {
            current_value -= step_value;
            updateVaruableValue(block_id, current_value);

        } 
        else if (step_sign === "*") {
            current_value *= step_value;
            updateVaruableValue(block_id, current_value);
        } 
        else if (step_sign === "//") {
            if (step_value !== 0) {
                current_value = Math.floor(current_value / step_value);
                updateVaruableValue(block_id, current_value);
            }
        }
    }

    if (iteration_count >= max_iterations) {
        console.log("Превышено максимальное количество итераций в цикле for");
        InvalidSyntacsisError();
    }


    let my_endfor_id = findEndForBlockId(block_id);
    if (my_endfor_id) {
        let next_after_endfor = connections.find(conn => 
            conn.parent === my_endfor_id && conn.parent_block_type === "endfor_block"
        );
        return next_after_endfor ? next_after_endfor.child : null;
    }
    
    return null;
}


function isMyEndForBlock(cycle_block_id, endfor_block_id) {

    let current_id = cycle_block_id;
    let current_type = "cycle_for_block";
    let nested_level = 0;
    
    while (current_id) {
        let next_connection = connections.find(conn => 
            conn.parent === current_id && conn.parent_block_type === current_type
        );
        
        if (!next_connection) break;
        
        current_id = next_connection.child;
        current_type = next_connection.child_block_type;
        
        if (current_id === endfor_block_id) {
            return nested_level === 0; 
        }
        
        if (current_type === "cycle_for_block") {
            nested_level++;
        } else if (current_type === "endfor_block") {
            nested_level--;
        }
    }
    
    return false;
}


function findEndForBlockId(for_block_id) {
    let current_id = for_block_id;
    let current_type = "cycle_for_block";
    let nested_level = 0;
    
    while (current_id) {
        let next_connection = connections.find(conn => 
            conn.parent === current_id && conn.parent_block_type === current_type
        );
        
        if (!next_connection) break;
        
        current_id = next_connection.child;
        current_type = next_connection.child_block_type;
        
        if (current_type === "cycle_for_block") {
            nested_level++;
        }

        else if (current_type === "endfor_block") {
            if (nested_level > 0) {
                nested_level--;
                continue;  
            } 
            else {
                return current_id;
            }
        }
    }
    console.log("Не найден endfor_block");
    InvalidSyntacsisError();
    return null;
}


function HandleCycleWhileBlock(block_id ) {
    let block = document.getElementById(block_id); 
    if (!block) return null; 

    let endwhile_id = findEndWhileBlockId(block_id);

    if (!endwhile_id)
    {
        return null;
    }
    
    
    let while_block_data = getWhileBlockData(block_id);

    if (!while_block_data) {
        return null;
    }

    function getActualValue(value)
    {
        let variable = varuable_list.find(v => v.varuable_name === value);
        if (variable)
        {
            return Number(variable.varuable_value);
        }
        return Number(value);
    }

    let operator = while_block_data.operator;
    
    let first_block_connection = connections.find(conn => conn.parent_block_type === "cycle_while_block" && conn.parent === block_id);

    if (!first_block_connection)
    {
        return null;
    }

    function checkCondition()
    {
        let left_val = Number(evaluateExpression(while_block_data.left));
        let right_val = Number(evaluateExpression(while_block_data.right));

        switch(operator)
        {
            case ">": return left_val > right_val;
            case "<": return left_val < right_val;
            case "=": return left_val == right_val;
            case "!=": return left_val != right_val;
            case ">=": return left_val >= right_val;
            case "<=": return left_val <= right_val;
            default: return false;
        }
    }

    let iteration_count = 0;
    let max_iterations = 1000;

    while (checkCondition() && iteration_count < max_iterations) {
        iteration_count++;

        let current_block_id = first_block_connection.child;
        let current_block_type = first_block_connection.child_block_type;

        while (current_block_id && current_block_type !== "endwhile_block") {

            if (current_block_type === "cycle_for_block")
            {
                HandleCycleForBlock(current_block_id);

                
                let nested_endfor = findEndForBlockId(current_block_id);

                if (nested_endfor)
                {
                    let next_after_nested = connections.find(conn => conn.parent === nested_endfor && conn.parent_block_type === "endfor_block");

                    if (next_after_nested) {
                        current_block_id = next_after_nested.child;
                        current_block_type = next_after_nested.child_block_type;
                        continue;
                    }
                }
            }

            else if (current_block_type === "cycle_while_block")
            {
                HandleCycleWhileBlock(current_block_id);

                let nested_endwhile = findEndWhileBlockId(current_block_id);

                if (nested_endwhile)
                {
                    let next_after_nested = connections.find(conn => conn.parent === nested_endwhile && conn.parent_block_type === "endwhile_block");

                    if (next_after_nested)
                    {
                        current_block_id = next_after_nested.child;
                        current_block_type = next_after_nested.child_block_type;
                        continue;
                    }
                }
            }

            else 
            {
                HandleAnyBlock(current_block_type, current_block_id);
            }

            let next_connection = connections.find(conn => conn.parent === current_block_id && conn.parent_block_type === current_block_type);


            if (next_connection)
            {
                current_block_id = next_connection.child;
                current_block_type = next_connection.child_block_type;
            }
            else 
                break;
        }
    }

    if (iteration_count >= max_iterations) {
        console.log("Превышено максимальное количество интераций в цикле while");
        InvalidSyntacsisError();
        return null;
    }


    if (endwhile_id)
    {
        let next_after_endwhile = connections.find(conn => conn.parent === endwhile_id && conn.parent_block_type === "endwhile_block");

        return next_after_endwhile ? next_after_endwhile.child : null;
    
    }

    return null;
}

function findEndWhileBlockId(while_block_id) {

    let current_id = while_block_id;
    let current_type = "cycle_while_block";
    let nested_level = 0;

    while (current_id) {
        let next_connection = connections.find(conn => conn.parent === current_id && conn.parent_block_type === current_type);

        if (!next_connection) 
            break;

        current_id = next_connection.child;
        current_type = next_connection.child_block_type;

        if (current_type === "cycle_while_block" || current_type === "cycle_for_block")
        {
            nested_level++;
        }

        else if (current_type === "endwhile_block" || current_type === "endfor_block")
        {
            if (nested_level > 0)
            {
                nested_level--;
                continue;

            }
            else {
                return current_id;
            }
        }
    }
    console.log("end_while не найден")
    InvalidSyntacsisError();
    return null;
}

function HandleArrayIndexBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) return null; 
    let array_index_block_data = getArrayIndexValue(block_id);

    if (!array_index_block_data) {
        console.log("вы не ввели ничего");
        return null; 
    }

    let right_value = evaluateExpression(array_index_block_data.right); 
    let left_str = array_index_block_data.left; 

   const left_match = String(left_str).trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)\[(.+)\]$/);

    if (left_match) {
        let array_name  = left_match[1];
        // индекс тоже может быть выражением: arr[n - i + 1]
        let array_index = Number(evaluateExpression(left_match[2]));

        let found_array = ArrayName.find(a => a.array_name === array_name);
        if (!found_array) {
            InvalidSyntacsisError();
            return null;
        }

        found_array.array_elements[array_index] = right_value;
    }

    else {
        // просто переменная
        let found_varuable = varuable_list.find(v => v.varuable_name === left_str);
        if (found_varuable) {
            found_varuable.varuable_value = right_value;
        } else {
            InvalidSyntacsisError();
            return null;
        }
    }
    


    let connection = connections.find(conn => 
        conn.parent === block_id && conn.parent_block_type === "array_index_block"
    );

    return connection ? connection.child : null;
} 

function HandeAndBlock(block_id) {
    let block = connections.find(conn => 
        conn.child === block_id && conn.child_block_type === "logic_and_block" && conn.position === "horizontal" && conn.parent_block_type === "if_block"
    );

    if (!block) { console.log("блок не найден"); return null; }

    let forms_data = getIfBlockValue(block_id);

    if (!forms_data) {console.log("Что то не то с вводом"); return null; }
    

    let left_str = evaluateExpression(forms_data.left);
    let right_str = evaluateExpression(forms_data.right);

    let left; 
    let left_array_check = checkIsArray(left_str);

    if (left_array_check !== null) {
        left = left_array_check.array_element_value; 
    } 
    
    else {
        let found_left_varuable = varuable_list.find(varuable => 
            varuable.varuable_name === left_str
        );

        if (found_left_varuable) {
            left = found_left_varuable.varuable_value;
        }

        else {
            left = Number(left_str);
        }
    }

    let operator = forms_data.operator; 
    let bool_result; 

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

    
    return bool_result; 
}

//window.script = this; 
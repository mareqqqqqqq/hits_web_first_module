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
            conn.parent_block_type === "if_block" && conn.parent === block_id && position === "vertical"); // block_id эт айдишка if блока нашли это соеднение 

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
                conn.parent === next_block_id && conn.parent_block_type === next_block_type && position === "vertical"
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
        return null;
    }

    let output = getOutputBlockValue(block.id); 

    if (!output) {
        console.log("вы ничего не ввели в output блок")
    }

    let found_varuable = varuable_list.find(varuable => 
        varuable.varuable_name === output
    );

    if (!found_varuable) {
        console.log(output);
    }

    else {
        console.log(found_varuable.varuable_value);
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
    let current_assignment_block_type = current_assignment_connection ? current_assignment_connection.child_block_type : null; 
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

    // основная перменная надо которой совершается арифметика 
    let main_varuable_name = arif_block_input.varuable_name;
    let main_varuable_value; 

    let found_main_varuable = varuable_list.find(varuable => 
        varuable.varuable_name === main_varuable_name
    );

    if (!found_main_varuable) {
        console.log("переменная с таким именем не найдена");
        return null;   
    }

    main_varuable_value = Number(found_main_varuable.varuable_value);



    // обработка левой перменной(или не перем)
    let left_varuable_name = arif_block_input.left;
    let left_varuable_value

    let found_left_varuable = varuable_list.find(varuable => 
        varuable.varuable_name === left_varuable_name
    );
    
    if (!found_left_varuable) {
        left_varuable_value = Number(left_varuable_name);         
    }

    else {
        left_varuable_value = Number(found_left_varuable.varuable_value);
    } 



    let right_varuable_name = arif_block_input.right; 
    let right_varuable_value; 

    let found_right_varuable = varuable_list.find(varuable =>
        varuable.varuable_name === right_varuable_name
    );
    
    if (!found_right_varuable) {
        right_varuable_value = Number(right_varuable_name); 
    }

    else {
        right_varuable_value = Number(found_right_varuable.varuable_value); 
    }


    let operator = arif_block_input.operator;

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

    found_main_varuable.varuable_value = arif_result;
    console.log("результат операции:", arif_result) 
    console.log("изменённая переменная", found_main_varuable);
}

function HandleArrayBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return;

    const array_data = getArrayBlockValue(block_id);

    if (!array_data) {
        console.log("ошибка ввода значений массива");
    }
}

function HandleCycleForBlock(block_id) {
    let block = document.getElementById(block_id);
    if (!block) return null; 

    let for_cycle_data = getForCycleValue(block_id); 

    if (!for_cycle_data) {
        console.log("значения в for не найдены");
        return;
    }

    let var_name = for_cycle_data.cycle_varuable;
    let start_value = Number(for_cycle_data.cycle_start_value);
    let stop_value = Number(for_cycle_data.cycle_varuable_stop);
    let operator = for_cycle_data.cycle_operator_select;
    let step_sign = for_cycle_data.cycle_step_sign;
    let step_value = Number(for_cycle_data.cycle_step_value);
    
    let current_value = start_value;

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
        
        updateVariable(var_name, current_value);
        
        let current_block_id = first_block_connection.child;
        let current_block_type = first_block_connection.child_block_type;
        
        // Проходим по всем блокам до СВОЕГО endfor_block
        while (current_block_id) {
            // ЕСЛИ ЭТО НАЧАЛО ВЛОЖЕННОГО ЦИКЛА
            if (current_block_type === "cycle_for_block") {
                // Выполняем вложенный цикл
                HandleCycleForBlock(current_block_id);
                
                // ВАЖНО: После выполнения вложенного цикла,
                // перепрыгиваем к блоку после ЕГО endfor_block
                let nested_endfor = findEndForBlockId(current_block_id);
                if (nested_endfor) {
                    // Находим следующий блок после endfor вложенного цикла
                    let next_after_nested = connections.find(conn => 
                        conn.parent === nested_endfor && conn.parent_block_type === "endfor_block"
                    );
                    
                    if (next_after_nested) {
                        current_block_id = next_after_nested.child;
                        current_block_type = next_after_nested.child_block_type;
                        continue; // Продолжаем со следующего блока
                    }
                }
            }
            
            // ЕСЛИ ДОШЛИ ДО endfor_block
            if (current_block_type === "endfor_block") {
                // Проверяем, принадлежит ли этот endfor_block текущему циклу
                if (isMyEndForBlock(block_id, current_block_id)) {
                    break; // Выходим из цикла - это наш endfor
                }
                // Если это не наш endfor (принадлежит вложенному циклу), просто пропускаем его
                else {
                    // Ищем следующий блок после чужого endfor
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
            
            // Обрабатываем обычные блоки (не циклы и не endfor)
            if (current_block_type !== "cycle_for_block" && current_block_type !== "endfor_block") {
                HandleAnyBlock(current_block_type, current_block_id);
            }
            
            // Ищем следующий блок
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
        
        previous_value = current_value;

        if (step_sign === "+") {
            current_value += step_value;
        } 
        else if (step_sign === "-") {
            current_value -= step_value;
        } 
        else if (step_sign === "*") {
            current_value *= step_value;
        } 
        else if (step_sign === "//") {
            if (step_value !== 0) {
                current_value = Math.floor(current_value / step_value);
            }
        }
    }

    if (iteration_count >= max_iterations) {
        console.log("Превышено максимальное количество итераций в цикле for");
        InvalidSyntacsisError();
    }

    // Находим следующий блок после СВОЕГО endfor_block
    let my_endfor_id = findEndForBlockId(block_id);
    if (my_endfor_id) {
        let next_after_endfor = connections.find(conn => 
            conn.parent === my_endfor_id && conn.parent_block_type === "endfor_block"
        );
        return next_after_endfor ? next_after_endfor.child : null;
    }
    
    return null;
}

// Новая функция для проверки, принадлежит ли endfor_block текущему циклу
function isMyEndForBlock(cycle_block_id, endfor_block_id) {
    // Находим путь от cycle_block до endfor_block
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
            return nested_level === 0; // Это наш endfor, если уровень вложенности 0
        }
        
        if (current_type === "cycle_for_block") {
            nested_level++;
        } else if (current_type === "endfor_block") {
            nested_level--;
        }
    }
    
    return false;
}

function updateVariable(var_name, value) {
    // Ищем существующую переменную
    let existing_var = varuable_list.find(v => v.varuable_name === var_name);
    
    if (existing_var) {
        existing_var.varuable_value = value;
    } else {
        // Если переменная не найдена, создаём новую
        varuable_list.push({
            varuable_block_id: null,
            varuable_block_type: "cycle_variable",
            varuable_name: var_name,
            varuable_value: value,
            assignment_value: null,
            assignment_type: null
        });
    }
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

function HandleCycleWhileBlock(block_id) {
    let block = document.getElementById(block_id); 
    if (!block) return null; 

    let endwhile_id = findEndWhileBlockId(block_id);

    if (!endwhile_id)
    {
        InvalidSyntacsisError();
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
        let left_val = getActualValue(while_block_data.left);
        let right_val = getActualValue(while_block_data.right);

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

    InvalidSyntacsisError();
    return null;
}

function HandleArrayIndexBlock(block_id) {
    let block = document.getElementById(block_id);

    if (!block) return null; 

    let array_index_block_data = getArrayIndexValue(block_id);

    let array_name = array_index_block_data.array_name; 
    let array_index = Number(array_index_block_data.array_index);

    let selected_array = ArrayName.find(conn => 
        conn.array_name === array_name // проверка на то что у нас в массиве ArrayName есть массив с таким же названием что выбрал пользователь
    );

    if (!selected_array) {
        console.log("Такого массива не существует"); 
        InvalidSyntacsisError(); 
        return null; 
    }

    let selected_array_elements = selected_array.array_elements; 
    let selected_array_length = selected_array.array_length;

    if (array_index < 0 || array_index >= selected_array_length) {
        console.log('элемент не существует или неверный индекс');
        return null; 
    }

    console.log("вы обратились к элементу:", selected_array_elements[array_index]);
} 

window.script = this; 
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

function getOutputBlockValue(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return; 
    
    const foreign_objects = block.querySelectorAll('foreignObject'); 

    function GetForeignObjectsValue(foreign_object) {
        let select = foreign_object.querySelector('select');
        let input = foreign_object.querySelector('input');

        if (select && select.style.display !== "none") {
            return select.value; 
        }

        else if (input && input.style.display !== "none") { 
            return input.value;             
        }
    }

    let data_from_form = GetForeignObjectsValue(foreign_objects[0]); 
    return data_from_form; 
}

function getArifBlockValue(block_id) {
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

    let left = GetForeignObjectsValue((foreign_objects[0])); 
    let right =  GetForeignObjectsValue((foreign_objects[2]));

    let operatorSelect = foreign_objects[1].querySelector('select');
    let operator = operatorSelect ? operatorSelect.value : null; 


    return {
        left: left, 
        operator:  operator, 
        right: right 
    }
}

function DownTheTree(start_block_id, start_block_type, end_block_type) {
    let current_connection = connections.find(conn => 
        conn.parent === start_block_id && conn.parent_block_type === start_block_type
    );

    // console.log("статр", current_connection);

    if (current_connection) {
        let next_block_id = current_connection.child;
        let next_block = document.getElementById(next_block_id);
        let next_block_type = next_block.dataset.data_type;

        while (next_block) {
            if (next_block_type == end_block_type) {

                current_connection = connections.find(conn => 
                     conn.parent === next_block_id && conn.parent_block_type === next_block_type
                );

                next_block_id = current_connection.child;
                next_block = document.getElementById(next_block_id);
                next_block_type = next_block.dataset.data_type;

                current_connection = connections.find(conn => 
                     conn.parent === next_block_id && conn.parent_block_type === next_block_type
                );

                //console.log("финал", current_connection);

                return current_connection; 
            }

            current_connection = connections.find(conn => 
                conn.parent === next_block_id && conn.parent_block_type === next_block_type
            );

            // console.log("шаг", current_connection);
            
            if (current_connection) {
                next_block_id = current_connection.child;
                next_block = document.getElementById(next_block_id);
                next_block_type = next_block.dataset.data_type;
            }

            else {
                InvalidSyntacsisError(); 
                break; 
            }
        }
    }

    else {
        InvalidSyntacsisError(); 
        return null;
    }
}

window.script = this;
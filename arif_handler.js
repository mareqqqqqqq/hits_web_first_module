function getInputArifOperator(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;

    const foreignObjects = block.querySelectorAll("foreignObject");
    for (let fo of foreignObjects) {
        if (!fo.dataset.slot) {
            const sel = fo.querySelector("select");
            if (sel) return sel.value;
        }
    }
    return null;
}

function getRawSlotUIValue(parent_block_id, slot_name) {
    const block = document.getElementById(parent_block_id);
    if (!block) return null;

    const slotEl = Array.from(block.querySelectorAll("[data-slot]")).find(el =>
        el.dataset.slot === slot_name && el.closest(".block") === block
    );
    
    if (!slotEl) return null;

    const select = slotEl.querySelector("select");
    const input  = slotEl.querySelector("input");

    if (select && select.style.display !== "none") return select.value || null;
    if (input  && input.style.display  !== "none") return input.value  || null;
    return null;
}

function applyArithmeticOperator(left, right, operator) {
    switch (operator) {
        case "+":  return left + right;
        case "-":  return left - right;
        case "*":  return left * right;
        case "//":
            if (right === 0) { InvalidSyntacsisError(); return null; }
            return Math.trunc(left / right);
        case "%":
            if (right === 0) { InvalidSyntacsisError(); return null; }
            return left % right;
        default:
            return null;
    }
}

function resolveSlotValue(parent_block_id, slot_name) {
    const slotConn = connections.find(c =>
        c.parent   === parent_block_id &&
        c.position === slot_name       &&
        c.child_block_type === "input_arif_block"
    );

    if (slotConn) { 
        return evaluateInputArifBlock(slotConn.child);
    }

    const raw = getRawSlotUIValue(parent_block_id, slot_name);
    if (raw === null || raw === "") return null;

    const result = evaluateExpression(raw);
    if (result === null || result === undefined) return null;

    return Number(result);
}

function evaluateInputArifBlock(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;

    const operator = getInputArifOperator(block_id);
    if (!operator) return null;

    const left  = resolveSlotValue(block_id, "slot_left");
    const right = resolveSlotValue(block_id, "slot_right");

    if (left === null || right === null) return null;

    return applyArithmeticOperator(left, right, operator);
}

function HandleArifBlock(block_id) {
    const block = document.getElementById(block_id);
    if (!block) return null;

    const foreignObjects = block.querySelectorAll("foreignObject");

    function getFOValue(fo) {
        if (!fo) return null;
        const select = fo.querySelector("select");
        const input  = fo.querySelector("input");
        if (select && select.style.display !== "none") return select.value || null;
        if (input  && input.style.display  !== "none") return input.value  || null;
        return null;
    }

    const main_varuable_name = getFOValue(foreignObjects[0]);

    if (!main_varuable_name) {
        InvalidSyntacsisError();
        return null;
    }

    const left = resolveSlotValue(block_id, "slot_left");

    if (left === null) {
        InvalidSyntacsisError();
        return null;
    }

    let operatorValue = null;
    let skippedFirst  = false;
    for (let fo of foreignObjects) {
        if (!fo.dataset.slot) {
            if (!skippedFirst) { skippedFirst = true; continue; }
            const sel = fo.querySelector("select");
            if (sel) { operatorValue = sel.value; break; }
        }
    }

    if (!operatorValue) {
        InvalidSyntacsisError();
        return null;
    }

    const right = resolveSlotValue(block_id, "slot_right");
    if (right === null) {
        InvalidSyntacsisError();
        return null;
    }

    const arif_result = applyArithmeticOperator(left, right, operatorValue);
    if (arif_result === null) return null;

    const check_main_is_array = checkIsArray(main_varuable_name);

    if (check_main_is_array) {
        const found_array = ArrayName.find(a => a.array_name === check_main_is_array.array_name);
        if (!found_array) {
            InvalidSyntacsisError();
            return null;
        }

        found_array.array_elements[check_main_is_array.array_index] = arif_result;
    } 

    else {
        const found_var = varuable_list.find(v => v.varuable_name === main_varuable_name);
        if (!found_var) {
            InvalidSyntacsisError();
            return null;
        }

        found_var.varuable_value = arif_result;
    }

    const connection = connections.find(c =>
        c.parent === block_id && c.parent_block_type === "arif_block" && c.position === "vertical"
    );
    
    return connection ? connection.child : null;
}
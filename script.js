function addLine(text, type = "output") {
    const body = document.getElementById("outputBody");
    if (!body) return;
    const div = document.createElement("div");
    div.className = "line " + type;
    div.textContent = text;
    body.insertBefore(div, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
}

(function () {
    const _log = console.log.bind(console);
    const _warn = console.log.bind(console);
    const _error = console.error.bind(console);

    function toLine (args, type) {
        const text = args.map(a =>
            (a !== null && typeof a === 'object') ? JSON.stringify(a) : String(a)
        ).join(' ');
        if (typeof addLine === 'function') {
            addLine(text, type);
        }
    }

    console.log = function (...args) { _log(...args); toLine(args, 'info');};
    console.warn = function (...args) { _warn(...args); toLine(args, 'info');};
    console.error = function (...args) { _error(...args); toLine(args, 'error');};

    window.addEventListener('error', (e) => {
        if (typeof addLine === 'function') {
            addLine('Error: ' + e.message, 'error');
        }
    });
})();

const canvas = document.getElementById('canvas');
const viewport = document.getElementById('viewport'); 
const trash_bin = document.getElementById('trash_bin');
const clearButton = document.getElementById("clearContentButton");

let selected = null; 
let offsetX = 0; 
let offsetY = 0; 
let connections = [];

let isPanning = false;
let startPoint = { x: 0, y: 0 };
let currentTranslate = { x: 0, y: 0 };

const SNAP_OVERLAP = 10; 

canvas.addEventListener('mousedown', (e) => {
    if (e.target === canvas) {
        isPanning = true;
        startPoint = { x: e.clientX - currentTranslate.x, y: e.clientY - currentTranslate.y };
        canvas.style.cursor = 'grabbing';
    }
});

document.addEventListener('mousemove', (e) => {
    if (isPanning) {
        currentTranslate.x = e.clientX - startPoint.x;
        currentTranslate.y = e.clientY - startPoint.y;
        viewport.setAttribute('transform', `translate(${currentTranslate.x}, ${currentTranslate.y})`);
    } else if (selected) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - offsetX - currentTranslate.x;
        const y = e.clientY - rect.top - offsetY - currentTranslate.y;

        const oldM = selected.transform.baseVal.consolidate().matrix;
        const dx = x - oldM.e;
        const dy = y - oldM.f;

        selected.setAttribute('transform', `translate(${x},${y})`);

        moveSlotChildrenBy(selected, dx, dy);
    }
});

document.addEventListener('mouseup', () => {
    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = 'default';
    }
});

const sidebarBlocks = document.querySelectorAll(
    '.varuable_block, .else_block, .if_block, .assignment_block, .output_block, .arif_block, .cycle_for_block, .start_block, .endif_block, .endelse_block, .array_block, .cycle_while_block, .logic_and_block , .logic_or_block, .array_index_block, .endfor_block, .endwhile_block, .logic_not_block , .input_arif_block'
);

sidebarBlocks.forEach(el => {
    el.addEventListener('mousedown', e => {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - currentTranslate.x;
        const y = e.clientY - rect.top - currentTranslate.y;

        const classes = Array.from(el.classList);
        const dataType = classes.find(c => c.endsWith('_block'));

        const svgPath = el.querySelector('path');
        const color = svgPath ? getComputedStyle(svgPath).fill : '#4caf50';

        const path = createBlock(x, y, color, 'block_' + Date.now(), dataType);

        selected = path;
        offsetX = 20; 
        offsetY = 20;
        selected.style.cursor = 'grabbing';
    });
});




function rebuildPath(group) {
    const path = group.querySelector("path");
    if (!path) return;
    const W = parseInt(group.dataset.currentInnerW);
    if (isNaN(W)) return;
    if (group.dataset.data_type === "arif_block") {
        path.setAttribute("d",
            `M0,0 h10 l10,10 h25 l10,-10 h${W} v65 h-${W} l-10,10 h-25 l-10,-10 h-10 v-65 Z`
        );
    } else if (group.dataset.data_type === "input_arif_block") {
        path.setAttribute("d", `M0,0 h${W} v40 h-${W} Z`);
    }
}

function getSlotEl(group, slotName) {
    return Array.from(group.querySelectorAll("[data-slot]"))
        .find(r => r.dataset.slot === slotName && r.closest(".block") === group) || null;
}

function getSlotParent(childId) {
    const conn = connections.find(c => c.child === childId &&
        (c.position === "slot_left" || c.position === "slot_right"));
    return conn ? document.getElementById(conn.parent) : null;
}

function findSlotNameForChild(parentId, childId) {
    const conn = connections.find(c => c.parent === parentId && c.child === childId &&
        (c.position === "slot_left" || c.position === "slot_right"));
    return conn ? conn.position : null;
}


function shiftRightOf(parentGroup, slotEl, delta) {
    const SLOT_BASE_W = 80;
    const slotRightEdge = parseFloat(slotEl.getAttribute("x")) + SLOT_BASE_W;

    Array.from(parentGroup.childNodes).forEach(node => {
        if (!node.getAttribute) return;
        if (node === slotEl) return;
        if (node.tagName === "path") return;
        if (node.classList && node.classList.contains("block")) return;
        const nx = parseFloat(node.getAttribute("x"));
        if (!isNaN(nx) && nx >= slotRightEdge) {
            node.setAttribute("x", nx + delta);
        }
    });


    connections
        .filter(c => c.parent === parentGroup.id &&
            (c.position === "slot_left" || c.position === "slot_right") &&
            c.position !== slotEl.dataset.slot)
        .forEach(c => {
            const childSlotEl = getSlotEl(parentGroup, c.position);
            if (!childSlotEl) return;
            const childSlotX = parseFloat(childSlotEl.getAttribute("x"));
            if (childSlotX >= slotRightEdge) {
                const childBlock = document.getElementById(c.child);
                if (childBlock) {
                    const m = childBlock.transform.baseVal.consolidate().matrix;
                    childBlock.setAttribute("transform", `translate(${m.e + delta}, ${m.f})`);
                    moveSlotChildrenBy(childBlock, delta, 0);
                }
            }
        });
}

function growParent(parentGroup, childGroup, slotName, deltaOverride) {
    const SLOT_W = 80;
    const childW = parseInt(childGroup.dataset.currentInnerW) || SLOT_W;
    const extra = deltaOverride !== undefined ? deltaOverride : Math.max(0, childW - SLOT_W);
    if (extra === 0) return;

    const slotEl = getSlotEl(parentGroup, slotName);
    if (slotEl) {
        const prev = parseInt(slotEl.dataset.addedExtra || "0");
        slotEl.dataset.addedExtra = prev + extra;
    }

    parentGroup.dataset.currentInnerW = parseInt(parentGroup.dataset.currentInnerW) + extra;
    rebuildPath(parentGroup);
    if (slotEl) shiftRightOf(parentGroup, slotEl, extra);

    const grandParent = getSlotParent(parentGroup.id);
    if (grandParent) {
        const gpSlot = findSlotNameForChild(grandParent.id, parentGroup.id);
        if (gpSlot) growParent(grandParent, parentGroup, gpSlot, extra);
    }
}

function shrinkParent(parentGroup, childGroup, slotName, deltaOverride) {
    const slotEl = getSlotEl(parentGroup, slotName);
    const extra = deltaOverride !== undefined
        ? deltaOverride
        : (slotEl ? parseInt(slotEl.dataset.addedExtra || "0") : 0);
    if (extra === 0) return;

    if (slotEl) {
        const prev = parseInt(slotEl.dataset.addedExtra || "0");
        slotEl.dataset.addedExtra = Math.max(0, prev - extra);
    }

    parentGroup.dataset.currentInnerW = parseInt(parentGroup.dataset.currentInnerW) - extra;
    rebuildPath(parentGroup);
    if (slotEl) shiftRightOf(parentGroup, slotEl, -extra);

    const grandParent = getSlotParent(parentGroup.id);
    if (grandParent) {
        const gpSlot = findSlotNameForChild(grandParent.id, parentGroup.id);
        if (gpSlot) shrinkParent(grandParent, parentGroup, gpSlot, extra);
    }
}


function moveSlotChildrenBy(block, dx, dy) {
    connections
        .filter(c => c.parent === block.id &&
            (c.position === "slot_left" || c.position === "slot_right"))
        .forEach(c => {
            const child = document.getElementById(c.child);
            if (!child) return;
            const m = child.transform.baseVal.consolidate().matrix;
            child.setAttribute("transform", `translate(${m.e + dx}, ${m.f + dy})`);
            moveSlotChildrenBy(child, dx, dy);
        });
}

function bringToFrontWithChildren(rootBlock) {
    viewport.appendChild(rootBlock);
    ["slot_left", "slot_right"].forEach(pos => {
        const conn = connections.find(c => c.parent === rootBlock.id && c.position === pos);
        if (!conn) return;
        const child = document.getElementById(conn.child);
        if (child) bringToFrontWithChildren(child);
    });
}

function getSlotRoot(block) {
    let cur = block;
    while (true) {
        const pc = connections.find(c => c.child === cur.id &&
            (c.position === "slot_left" || c.position === "slot_right"));
        if (!pc) return cur;
        const parent = document.getElementById(pc.parent);
        if (!parent) return cur;
        cur = parent;
    }
}



canvas.addEventListener('mouseup', () => {
    if (!selected || isPanning) return;


    if (selected.dataset.data_type === "input_arif_block") {
        const selPos = getBlockPos(selected);
        const selBBox = selected.getBBox();
        const selCX = selPos.x + selBBox.width / 2;
        const selCY = selPos.y + selBBox.height / 2;

        const allSlots = Array.from(viewport.querySelectorAll("[data-slot]")).filter(slot => {
            if (slot.dataset.occupied === "true") return false;
            if (parseFloat(slot.getAttribute("width") || "80") === 0) return false;
            const pg = slot.closest(".block");
            if (!pg || pg === selected) return false;

            let cur = pg;
            while (cur) {
                if (cur === selected) return false;
                const conn = connections.find(c => c.child === cur.id &&
                    (c.position === "slot_left" || c.position === "slot_right"));
                cur = conn ? document.getElementById(conn.parent) : null;
            }
            return true;
        });

        let bestSlot = null;
        let bestDist = 60;
        for (let slot of allSlots) {
            const pg = slot.closest(".block");
            const pgPos = getBlockPos(pg);
            const sx = pgPos.x + parseFloat(slot.getAttribute("x")) + 40;
            const sy = pgPos.y + parseFloat(slot.getAttribute("y")) + parseFloat(slot.getAttribute("height") || "30") / 2;
            const dist = Math.hypot(selCX - sx, selCY - sy);
            if (dist < bestDist) { bestDist = dist; bestSlot = slot; }
        }

        if (bestSlot) {
            const parentGroup = bestSlot.closest(".block");
            const parentPos = getBlockPos(parentGroup);
            const slotX = parseFloat(bestSlot.getAttribute("x"));
            const slotY = parseFloat(bestSlot.getAttribute("y"));
            const slotH = parseFloat(bestSlot.getAttribute("height") || "30");


            const parentH = parentGroup.getBBox().height;
            const childH = selected.getBBox().height;
            const newX = parentPos.x + slotX;
            const newY = parentPos.y + (parentH - childH) / 2;
            selected.setAttribute("transform", `translate(${newX}, ${newY})`);

            bestSlot.dataset.occupied = "true";
            bestSlot.setAttribute("width", "0");
            bestSlot.setAttribute("height", "0");

            const slotName = bestSlot.dataset.slot;
            addConnection(parentGroup.id, selected.id, slotName, parentGroup.dataset.data_type, selected.dataset.data_type);

            growParent(parentGroup, selected, slotName);


            const root = getSlotRoot(parentGroup);
            bringToFrontWithChildren(root);

            selected.style.cursor = "grab";
            selected = null;
            return;
        }
    }


    const selBox = selected.getBBox(); 
    const selPos = getBlockPos(selected); 
    const allBlocks = Array.from(viewport.querySelectorAll('.block')); 

    let targetX = selPos.x;
    let targetY = selPos.y;
    let snappedVer = false;
    let snappedHor = false;

    const isConnectorFree = (blockId, position) => !connections.some(c => c.parent === blockId && c.position === position);
    const isInputFree = (blockId, position) => !connections.some(c => c.child === blockId && c.position === position);

    for (let block of allBlocks) {
        if (block === selected) continue;

        const bBox = block.getBBox();
        const bPos = getBlockPos(block);

        const dxVer = Math.abs(selPos.x - bPos.x); 
        if (dxVer < 50) {
            const targetYBottom = bPos.y + bBox.height - SNAP_OVERLAP; 
            const targetYTop = bPos.y - selBox.height + SNAP_OVERLAP;

            if (Math.abs(selPos.y - targetYBottom) < 50 && 
                selected.dataset.connectionTop === "true" && 
                block.dataset.connectorBottom === "true" &&
                isConnectorFree(block.id, "vertical") && isInputFree(selected.id, "vertical")) {
                targetX = bPos.x;
                targetY = targetYBottom;
                addConnection(block.id, selected.id, "vertical", block.dataset.data_type, selected.dataset.data_type);
                snappedVer = true;
            } 

            if (Math.abs(selPos.y - targetYTop) < 50 && 
                selected.dataset.connectorBottom === "true" && 
                block.dataset.connectionTop === "true" &&
                isConnectorFree(selected.id, "vertical") && isInputFree(block.id, "vertical")) {
                targetX = bPos.x;
                targetY = targetYTop;
                addConnection(selected.id, block.id, "vertical", selected.dataset.data_type, block.dataset.data_type);
                snappedVer = true;
            }
        }

        const dyHor = Math.abs(selPos.y - bPos.y);
        if (dyHor < 50) {
            const targetXRight = bPos.x + bBox.width - SNAP_OVERLAP;
            const targetXLeft = bPos.x - selBox.width + SNAP_OVERLAP;

            if (Math.abs(selPos.x - targetXRight) < 50 && 
                selected.dataset.connectionLeft === "true" && 
                block.dataset.connectorRight === "true" &&
                isConnectorFree(block.id, 'horizontal') && isInputFree(selected.id, 'horizontal')) {
                targetX = targetXRight;
                if (!snappedVer) targetY = bPos.y; 
                addConnection(block.id, selected.id, "horizontal", block.dataset.data_type, selected.dataset.data_type);
                snappedHor = true;
            }

            if (Math.abs(selPos.x - targetXLeft) < 50 && 
                selected.dataset.connectorRight === "true" && 
                block.dataset.connectionLeft === "true" &&
                isConnectorFree(selected.id, 'horizontal') && isInputFree(block.id, 'horizontal')) {
                targetX = targetXLeft;
                if (!snappedVer) targetY = bPos.y;
                addConnection(selected.id, block.id, "horizontal", selected.dataset.data_type, block.dataset.data_type);
                snappedHor = true;
            }
        }
    }

    if (snappedVer || snappedHor) {
        selected.setAttribute('transform', `translate(${targetX}, ${targetY})`);
    }

    selected.style.cursor = 'grab';
    selected = null;
});


canvas.addEventListener('mousedown', e => {
    const block = e.target.closest('.block'); 
    if (!block) return; 

    e.preventDefault();

    const blockId = block.id;
    const blockType = block.dataset.data_type;

    if (blockType === "input_arif_block") {
        const hasChildren = connections.some(c => c.parent === blockId &&
            (c.position === "slot_left" || c.position === "slot_right"));
        if (hasChildren) return;
    }


    if (blockType === "input_arif_block") {
        const conn = connections.find(c => c.child === blockId &&
            (c.position === "slot_left" || c.position === "slot_right"));
        if (conn) {
            const parentGroup = document.getElementById(conn.parent);
            const slotName = conn.position;
            if (parentGroup) {
                shrinkParent(parentGroup, block, slotName);
                const slotEl = getSlotEl(parentGroup, slotName);
                if (slotEl) {
                    slotEl.dataset.occupied = "false";
                    slotEl.setAttribute("width", "80");
                    slotEl.setAttribute("height", slotEl.dataset.baseHeight || "30");
                }
            }
            connections = connections.filter(c => !(c.child === blockId && c.parent === conn.parent));
        }
    }


    bringToFrontWithChildren(block);

    if (blockType === "assignment_block") {
        resetAssignmentBlock(blockId);
    }


    connections = connections.filter(conn => {
        const isSlotConn = (conn.position === "slot_left" || conn.position === "slot_right");
        if (conn.parent === blockId && !isSlotConn) return false;
        if (conn.child === blockId && !isSlotConn) return false;
        return true;
    });

    if (blockType === "varuable_block") {
        varuable_list = varuable_list.filter(v => v.block_id !== blockId);
    }

    selected = block; 
    const rect = canvas.getBoundingClientRect();
    const matrix = selected.transform.baseVal.consolidate().matrix;

    offsetX = e.clientX - rect.left - matrix.e - currentTranslate.x;
    offsetY = e.clientY - rect.top - matrix.f - currentTranslate.y;

    selected.style.cursor = 'grabbing';
});

function resetAssignmentBlock(blockId) {
    const block = document.getElementById(blockId);
    if (!block) return;

    const div = block.querySelector('div[contenteditable = "true"]');
    if (!div) return;

    const connection = connections.find(conn => 
        conn.child === blockId &&
        conn.parent_block_type === "varuable_block"
    );

    if (connection) {
        updateVaruableValue(connection.parent, 0);
    }
}

function getBlockPos(block) {
    const matrix = block.transform.baseVal.consolidate().matrix;
    return { x: matrix.e, y: matrix.f };
}

function addConnection(parentId, childId, pos, parentType, childType) {
    if (!connections.some(c => c.parent === parentId && c.child === childId)) {
        connections.push({ parent: parentId, child: childId, position: pos, parent_block_type: parentType, child_block_type: childType});

        if (childType === "varuable_block"){
            if (!varuable_list.some(v => v.block_id === childId)) {
                const name = getVaruableBlockValue(childId);
                varuable_list.push({
                    block_id: childId,
                    block_type: "varuable_block",
                    varuable_name: name,
                    varuable_value: null
                });
                refreshAllVariableSelectors();
            }
        }
    }
    if (parentType === "varuable_block" && childType === "assignment_block") {
        const block = document.getElementById(childId);
        const div = block.querySelector('div[contenteditable = "true"]');
        if (div) {
            const value = div.textContent.trim();
            updateVaruableValue(parentId, value || 0);
        }
    }
}

trash_bin.addEventListener('mouseenter', () => {
    trash_bin.classList.add('shaking');
});

trash_bin.addEventListener('mouseleave', () => {
    trash_bin.classList.remove('shaking');
});

trash_bin.addEventListener('mouseup', () => {
    if (!selected) return; 
    const id = selected.id;

    function removeWithChildren(blockId) {
        const childConns = connections.filter(c => 
            c.parent === blockId && (c.position === "slot_left" || c.position === "slot_right")
        );

        for (const c of childConns) {
            removeWithChildren(c.child);
        }

        const el = document.getElementById(blockId); 
        if (el) el.remove(); 
    }

    removeWithChildren(id);
    connections = connections.filter(conn => conn.parent !== id && conn.child !== id);
    selected.remove(); 
    selected = null; 
});

clearButton.addEventListener("click", () => { 
    const blocks = viewport.querySelectorAll(".block");

    for (const block of blocks) {
        block.classList.add("clear"); 
        setTimeout(() => block.romove(), 300);
    }

    varuable_list.length = 0;
    connections = []; 
    ArrayName = [];
    selected = null;
});

window.script = this;
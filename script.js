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
        selected.setAttribute('transform', `translate(${x},${y})`);
    }
});

document.addEventListener('mouseup', () => {
    if (isPanning) {
        isPanning = false;
        canvas.style.cursor = 'default';
    }
});



const sidebarBlocks = document.querySelectorAll(
    '.varuable_block, .else_block, .if_block, .assignment_block, .output_block, .arif_block, .cycle_for_block, .start_block, .endif_block, .endelse_block, .array_block, .cycle_while_block, .logic_and_block , .logic_or_block, .array_index_block, .endfor_block'
);

sidebarBlocks.forEach(el => {
    el.addEventListener('mousedown', e => {
        e.preventDefault();
        
        const color = 
            el.classList.contains('if_block') ? '#ffac3e' :
            el.classList.contains('else_block') ? '#fd4a4a' :
            el.classList.contains('assignment_block') ? '#4e4fbe' :
            el.classList.contains('varuable_block') ? 'rgb(76, 94, 170)' :
            el.classList.contains('output_block') ? '#a3a669' :
            el.classList.contains('arif_block') ? '#5caeb9' :
            el.classList.contains('cycle_for_block') ? '#0066ff' :
            el.classList.contains('endfor_block') ? '#0066ff' :
            el.classList.contains('cycle_while_block') ? '#0066ff' :
            el.classList.contains('start_block') ? '#25c733' :
            el.classList.contains('endif_block') ? '#ffac3e' :
            el.classList.contains('endelse_block') ? '#fd4a4a' :
            el.classList.contains('logic_and_block') ? '#734f96' :
            el.classList.contains('logic_or_block') ? '	#8FBC8F' :
            el.classList.contains('array_block') ? '#004af7' :
            el.classList.contains('array_index_block') ? '#004af7' :
            '#4caf50';

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - currentTranslate.x;
        const y = e.clientY - rect.top - currentTranslate.y;

        const classes = Array.from(el.classList);
        const dataType = classes.find(c => c.endsWith('_block'));

        const path = createBlock(x, y, color, 'block_' + Date.now(), dataType);

        selected = path;
        offsetX = 20; 
        offsetY = 20;
        selected.style.cursor = 'grabbing';
    });
});


canvas.addEventListener('mouseup', () => {
    if (!selected || isPanning) 
        return;

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
    viewport.appendChild(block); 

    const blockId = block.id; 
    connections = connections.filter(conn => conn.parent !== blockId && conn.child !== blockId);

    if (block.dataset.data_type === "varuable_block") {
        varuable_list = varuable_list.filter(v => v.block_id !== blockId);
    }

    selected = block; 
    const rect = canvas.getBoundingClientRect();
    const matrix = selected.transform.baseVal.consolidate().matrix;

    offsetX = e.clientX - rect.left - matrix.e - currentTranslate.x;
    offsetY = e.clientY - rect.top - matrix.f - currentTranslate.y;

    selected.style.cursor = 'grabbing';
});


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
}



trash_bin.addEventListener('mouseup', () => {
    if (!selected) return; 
    const id = selected.id;
    connections = connections.filter(conn => conn.parent !== id && conn.child !== id);
    selected.remove(); 
    selected = null; 
});

clearButton.addEventListener("click", () => { 
    const blocks = viewport.querySelectorAll(".block");
    blocks.forEach(block => {
        block.classList.add("clear");
        setTimeout(() => block.remove(), 300);
    });
    varuable_list.length = 0;
    connections = []; 
    selected = null;
});

function addLine(text, type = "output") {
    const body = document.getElementById("outputBody");
    if (!body) return;
    const div = document.createElement("div");
    div.className = "line " + type;
    div.textContent = text;
    body.insertBefore(div, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
}

window.script = this;
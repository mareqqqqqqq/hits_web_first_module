const canvas = document.getElementById('canvas');
let selected = null;
let offsetX = 0;
let offsetY = 0;
let connections = [];

// ------------------ СОЗДАНИЕ БЛОКА ------------------
function createBlock(x, y, color, id, data_type) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path");

    if (data_type === "varuable_block") {
        path.setAttribute("d", "M0,0 v15 l10,10 v15 l-10,10 v10 h20 l10,10 h20 l10,-10 h40 v-10 l10,-10 v-15 l-10,-10 v-15 Z");
    }

    if (data_type === "assignment_block") {
        path.setAttribute("d", "M0,0 v50 h60 v-50 h-10 l-10,10 h-20 l-10,-10 Z");
    }

    path.setAttribute("fill", color);
    path.setAttribute("transform", `translate(${x},${y})`);
    path.setAttribute("id", id);
    path.setAttribute("data-type", data_type);
    path.classList.add("block");

    canvas.appendChild(path);
    return path;
}

// ------------------ ПОЛУЧИТЬ ПОЗИЦИЮ ------------------
function getBlockPos(block) {
    const matrix = block.transform.baseVal.consolidate().matrix;
    return { x: matrix.e, y: matrix.f };
}

// ------------------ НАЙТИ ПРИЛИПАНИЕ ------------------
function findSnapTarget(draggedBlock, threshold = 15) {
    const blocks = Array.from(document.querySelectorAll('.block')).filter(b => b !== draggedBlock);
    const draggedType = draggedBlock.getAttribute('data-type');
    const draggedPos = getBlockPos(draggedBlock);
    
    let bestSnap = null;
    let bestDist = threshold;

    for (const target of blocks) {
        const targetType = target.getAttribute('data-type');
        const targetPos = getBlockPos(target);

        // VARIABLE К VARIABLE - левый выступ в правую выемку (горизонтально)
        if (draggedType === "varuable_block" && targetType === "varuable_block") {
            const draggedLeftTabX = draggedPos.x + 0;
            const draggedLeftTabY = draggedPos.y + 32;
            
            const targetRightNotchX = targetPos.x + 100;
            const targetRightNotchY = targetPos.y + 32;
            
            const dx = targetRightNotchX - draggedLeftTabX;
            const dy = targetRightNotchY - draggedLeftTabY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bestDist) {
                bestDist = dist;
                bestSnap = { dx, dy, target };
            }
        }

        // ASSIGNMENT К VARIABLE - верхняя выемка assignment к нижнему выступу variable
        if (draggedType === "assignment_block" && targetType === "varuable_block") {
            // Верхняя выемка assignment: глубина выемки y=10, центр x=30
            const draggedTopNotchX = draggedPos.x + 30;
            const draggedTopNotchY = draggedPos.y + 10;
            
            // Нижний выступ variable: кончик выступа y=70, центр x=40
            const targetBottomTabX = targetPos.x + 40;
            const targetBottomTabY = targetPos.y + 70;
            
            const dx = targetBottomTabX - draggedTopNotchX;
            const dy = targetBottomTabY - draggedTopNotchY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bestDist) {
                bestDist = dist;
                bestSnap = { dx, dy, target };
            }
        }

        // VARIABLE К ASSIGNMENT - нижний выступ variable в верхнюю выемку assignment
        if (draggedType === "varuable_block" && targetType === "assignment_block") {
            // Нижний выступ variable
            const draggedBottomTabX = draggedPos.x + 40;
            const draggedBottomTabY = draggedPos.y + 70;
            
            // Верхняя выемка assignment
            const targetTopNotchX = targetPos.x + 30;
            const targetTopNotchY = targetPos.y + 10;
            
            const dx = targetTopNotchX - draggedBottomTabX;
            const dy = targetTopNotchY - draggedBottomTabY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bestDist) {
                bestDist = dist;
                bestSnap = { dx, dy, target };
            }
        }

        // ASSIGNMENT К ASSIGNMENT
        if (draggedType === "assignment_block" && targetType === "assignment_block") {
            const draggedTopNotchX = draggedPos.x + 30;
            const draggedTopNotchY = draggedPos.y + 10;
            
            const targetBottomX = targetPos.x + 30;
            const targetBottomY = targetPos.y + 50;
            
            const dx = targetBottomX - draggedTopNotchX;
            const dy = targetBottomY - draggedTopNotchY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < bestDist) {
                bestDist = dist;
                bestSnap = { dx, dy, target };
            }
        }
    }

    return bestSnap;
}

// ------------------ САЙДБАР ------------------
const sidebarBlocks = document.querySelectorAll('.varuable_block, .for_cycle_block, .other_block, .assignment_block');

sidebarBlocks.forEach(el => {
    el.addEventListener('mousedown', e => {
        e.preventDefault();

        const color = 
            el.classList.contains('for_cycle_block') ? '#2196f3' :
            el.classList.contains('other_block') ? '#ff9800' :
            el.classList.contains('assignment_block') ? '#494bd4' :
            el.classList.contains('varuable_block') ? 'rgb(76, 94, 170)' :
            '#4caf50';

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const id = 'block_' + Date.now();
        let path;
        if (el.classList.contains("assignment_block")) {
            path = createBlock(x, y, color, id, "assignment_block");
        } else if (el.classList.contains("varuable_block")) {
            path = createBlock(x, y, color, id, "varuable_block");
        } else {
            path = createBlock(x, y, color, id, "varuable_block");
        }

        selected = path;
        offsetX = e.clientX - rect.left - x;
        offsetY = e.clientY - rect.top - y;
        selected.style.cursor = 'grabbing';
    });
});

// ------------------ ПЕРЕТАСКИВАНИЕ ------------------
document.addEventListener('mousemove', e => {
    if (!selected) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    selected.setAttribute('transform', `translate(${x},${y})`);
});

// ------------------ ПРИЛИПАНИЕ ------------------
document.addEventListener('mouseup', e => {
    if (!selected) return;

    const snap = findSnapTarget(selected, 15);
    
    if (snap) {
        const pos = getBlockPos(selected);
        selected.setAttribute('transform', `translate(${pos.x + snap.dx},${pos.y + snap.dy})`);

        connections.push({
            parent: snap.target.id,
            child: selected.id,
            direction: 'snap'
        });
        
        addLine(`Блок подключен`, "info");
    }

    selected.style.cursor = 'grab';
    selected = null;
});

// ------------------ УДАЛЕНИЕ СОЕДИНЕНИЙ ------------------
canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block')) return;

    const blockId = e.target.id;
    connections = connections.filter(conn => conn.parent !== blockId && conn.child !== blockId);

    e.preventDefault();
    selected = e.target;

    const rect = canvas.getBoundingClientRect();
    const matrix = selected.transform.baseVal.consolidate().matrix;
    offsetX = e.clientX - rect.left - matrix.e;
    offsetY = e.clientY - rect.top - matrix.f;
    selected.style.cursor = 'grabbing';
});

// ------------------ OUTPUT ------------------
function addLine(text, type = "output") {
    const body = document.getElementById("outputBody");
    const div = document.createElement("div");
    div.className = "line " + type;
    div.textContent = text;
    body.insertBefore(div, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
}

setTimeout(() => addLine("Programm is finished", "output"), 1500);
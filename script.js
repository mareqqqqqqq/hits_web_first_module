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

        let path = null;

        if (el.classList.contains("assignment_block")) {
            path = createBlock(x, y, color, 'block_' + Date.now(), "assignment_block");
        }
        else if (el.classList.contains("varuable_block")) {
            path = createBlock(x, y, color, 'block_' + Date.now(), "varuable_block");
        }
        else {
            path = createBlock(x, y, color, 'block_' + Date.now(), "varuable_block");
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

    const selMatrix = selected.transform.baseVal.consolidate().matrix;
    const selBBox = selected.getBBox();
    const selType = selected.getAttribute('data-type');

    const selX = selMatrix.e;
    const selY = selMatrix.f;

    const blocks = Array.from(document.querySelectorAll('.block'))
        .filter(b => b !== selected);

    blocks.forEach(block => {
        const m = block.transform.baseVal.consolidate().matrix;
        const bBox = block.getBBox();
        const blockType = block.getAttribute('data-type');

        const bx = m.e;
        const by = m.f;

        // ЛОГИКА ИЗ ПЕРВОГО ФАЙЛА - проверка расстояний по bBox
        const dxHor = Math.abs((selX) - (bx + bBox.width));
        const dyHor = Math.abs((selY + selBBox.height / 2) - (by + bBox.height / 2));

        const dxVer = Math.abs((selX + selBBox.width / 2) - (bx + bBox.width / 2));
        const dyVer = Math.abs(selY - (by + bBox.height));

        const hasHorizontalChild = connections.some(conn =>
            conn.parent === block.id && conn.direction === 'horizontal'
        );

        const hasVerticalChild = connections.some(conn =>
            conn.parent === block.id && conn.direction === 'vertical'
        );

        // ГОРИЗОНТАЛЬНОЕ прилипание
        if (dxHor < 40 && dyHor < 40 && !hasHorizontalChild) {
            // ПИКСЕЛИ ИЗ ВТОРОГО ФАЙЛА - точное позиционирование
            if (selType === "varuable_block" && blockType === "varuable_block") {
                const snapX = bx + 100; // правая выемка
                const snapY = by; // та же высота
                
                selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);

                connections.push({
                    parent: block.id,
                    child: selected.id,
                    direction: 'horizontal'
                });
            }
        }

        // ВЕРТИКАЛЬНОЕ прилипание
        else if (dxVer < 40 && dyVer < 40 && !hasVerticalChild) {
            // ПИКСЕЛИ ИЗ ВТОРОГО ФАЙЛА
            if (selType === "assignment_block" && blockType === "varuable_block") {
                const snapX = bx + 40 - 30; // выступ variable(40) - выемка assignment(30)
                const snapY = by + 70 - 10; // выступ variable(70) - выемка assignment(10)
                
                selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);

                connections.push({
                    parent: block.id,
                    child: selected.id,
                    direction: 'vertical'
                });
            }
            else if (selType === "varuable_block" && blockType === "assignment_block") {
                const snapX = bx + 30 - 40;
                const snapY = by + 10 - 70;
                
                selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);

                connections.push({
                    parent: block.id,
                    child: selected.id,
                    direction: 'vertical'
                });
            }
            else if (selType === "varuable_block" && blockType === "varuable_block") {
                const snapX = bx + 40 - 40; // центр к центру
                const snapY = by + 70 - 10;
                
                selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);

                connections.push({
                    parent: block.id,
                    child: selected.id,
                    direction: 'vertical'
                });
            }
        }
    });

    selected.style.cursor = 'grab';
    selected = null;
});

// ------------------ УДАЛЕНИЕ СОЕДИНЕНИЙ ------------------
canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block'))
        return;

    const blockId = e.target.id;

    connections = connections.filter(conn =>
        conn.parent != blockId && conn.child != blockId
    );

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
const canvas = document.getElementById('canvas');
let selected = null; // текущий выбранный блок 
let offsetX = 0; 
let offsetY = 0; 

function createBlock(x, y, color, id) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path"); 

    path.setAttribute("d", "M0,0 H80 v30 h-20 v10 h20 v30 h-80 z");
    path.setAttribute("fill", color); 
    path.setAttribute("transform", `translate(${x},${y})`); 
    path.setAttribute("id", id);
    path.classList.add("block"); 

    canvas.appendChild(path); //добавляет в дом блок виден и можн перетаскивать 
}

canvas.addEvent




canvas.addEventListener('mousemove',e => {
    if (!selected) 
        return;

    const pt = canvas.createSVGPoint();

    pt.x = e.clientX;
    pt.y = e.clientY;

    const x = pt.x - offsetX;
    const y = pt.y - offsetY;

    selected.setAttribute(`transform`, `translate(${x},${y})`);
})



canvas.addEventListener('mouseup', e => {
    if (!selected) return;

    const selMatrix = selected.transform.baseVal.consolidate().matrix;
    const selBBox = selected.getBBox();

    const selX = selMatrix.e;
    const selY = selMatrix.f;

    const blocks = Array.from(document.querySelectorAll('.block'))
        .filter(b => b !== selected);

    blocks.forEach(block => {
        const m = block.transform.baseVal.consolidate().matrix;
        const bBox = block.getBBox();

        const bx = m.e;
        const by = m.f;

        // расстояние между правым краем одного и левым краем другого
        const dx = Math.abs((selX + selBBox.width) - bx);
        const dy = Math.abs((selY + selBBox.height / 2) - (by + bBox.height / 2));

        // если достаточно близко — прилипает
        if (dx < 15 && dy < 15) {
            const snapX = bx - selBBox.width;
            const snapY = by;

            selected.setAttribute(
                'transform',
                translate(${snapX}, ${snapY})
            );
        }
    });

    selected.style.cursor = 'grab';
    selected = null;
});

// РАЗОБРАТЬ ЧТО ВЫШЕ ЗАВТРА ЖБШНО

// e - типо event  

canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block'))
        return;

    selected = e.target;

    const pt = canvas.createSVGPoint();

    pt.x = e.clientX;
    pt.y = e.clientY;

    const matrix = selected.transform.baseVal.consolidate().matrix;

    offsetX = pt.x - matrix.e;
    offsetY = pt.y - matrix.f;

    selected.style.cursor = 'grabbing';
})









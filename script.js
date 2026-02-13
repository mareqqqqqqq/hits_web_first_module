const canvas = document.getElementById('canvas');
let selected = null; // текущий выбранный блок 
let offsetX = 0; 
let offsetY = 0; 

//DONE!!!!!!!!!!!
function createBlock(x, y, color, id) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path"); // обтект svg 

    path.setAttribute("d", "M0,0 H80 v30 h-40 v10 h40 v30 h-80 Z"); // создание svg M0,0 старт h80 гор прямая итд d - атрибут для создания 
    path.setAttribute("fill", color); // заливка color как параметр
    path.setAttribute("transform", `translate(${x},${y})`); // куда сдвигаем svgшку
    path.setAttribute("id", id); // присваивает уникальный id короче(для дибилдо): он там ниже генерится в ф-ии где вызывается
    path.classList.add("block"); // добавляет клаасс block к svg тчоб можно было обратиться 

    canvas.appendChild(path); // добавляет path в svg html

    return path;
}

// создалт перемнную sidebarblocks котрая включает все наши div блоки потом чтобы ко всем обращаться 
const sidebarBlocks = document.querySelectorAll (
    '.varuable_block, .for_cycle_block, .other_block'
);

// для всех сайдбар блоков указываем действия для маус даун
sidebarBlocks.forEach(el => { // e - типо event  
    el.addEventListener('mousedown', e => { // когда событие маусдаун
        e.preventDefault(); 

        // задаём цвета для дивов, свг блоков, на самом деле
        const color = 
            el.classList.contains('for_cycle_block') ? '#2196f3' :
            el.classList.contains('other_block') ? '#ff9800' :
            '#4caf50';

    
    // получится обьект с полями: left top wigth height 
    const rect = canvas.getBoundingClientRect(); // возвращает позицию и размеры элемента на стринцу в px
    const x = e.clientX - rect.left; 
    const y = e.clientY - rect.top;

    // вызвали функцю(создался блок) также сохранили path(сам блок) чтобы дальше юзадть
    const path = createBlock(x, y, color, 'block_' + Date.now());
 
    //  этот болок выбран для перетасиквания 
    selected = path; 

    // вычисляем смещение 
    offsetX = e.clientX - rect.left - x; 
    offsetY = e.clientY - rect.top - y; 

    // сменили тип курсора на руку когда навелись 
    selected.style.cursor = 'grabbing';
    });
});

document.addEventListener('mousemove',e => {
    if (!selected) 
        return;

    const rect = canvas.getBoundingClientRect(); 
    const x = e.clientX - rect.left - offsetX; 
    const y = e.clientY - rect.top - offsetY;

    selected.setAttribute('transform', `translate(${x},${y})`);
});

document.addEventListener('mouseup', e => {
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
                `translate(${snapX}, ${snapY})`
            );
        }
    });

    selected.style.cursor = 'grab';
    selected = null;
});

// e - типо event  

canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block'))
        return;

    e.preventDefault(); 

    selected = e.target;

    const rect = canvas.getBoundingClientRect();

    const matrix = selected.transform.baseVal.consolidate().matrix;

    offsetX = e.clientX - rect.left - matrix.e; 
    offsetY = e.clientY - rect.top - matrix.f; 

    // на сколько мышь смещена по x и y (чтобы блок не прыгал) ^

    selected.style.cursor = 'grabbing';
})












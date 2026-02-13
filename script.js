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


// DONE !!!!!!!
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

//DONE !!!!!!!!!
// gперетаскивание блока 
document.addEventListener('mousemove',e => {
    if (!selected) // если не выбюран блок то пока  
        return;

    // получаем данные также как и в блоке выше через rect 
    const rect = canvas.getBoundingClientRect(); 
    const x = e.clientX - rect.left - offsetX;  // offset - чтобы блок не прыгал а оставался там где мы его схвалили 
    const y = e.clientY - rect.top - offsetY;   // перемещаем чтоб блок не прыгал, чтобы блок можно было захватить за любое его место(offset )

    // сдвигаем блок в новые коорды 
    selected.setAttribute('transform', `translate(${x},${y})`);
});

// слушаем на всём документе чтобы мы могли отпутить даже вне сanvas
document.addEventListener('mouseup', e => {
    if (!selected) return; // база)

    const selMatrix = selected.transform.baseVal.consolidate().matrix; // текущие коорды блока так же в матрице 
    const selBBox = selected.getBBox(); // границы выбранного блока 

    const selX = selMatrix.e; // получили коорды с матрицы 
    const selY = selMatrix.f; 

    const blocks = Array.from(document.querySelectorAll('.block')) // выбираем все блоки с нужным классом чтобы чекнуть к чему можно прилепить 
        .filter(b => b !== selected); // todo 

    blocks.forEach(block => {
        const m = block.transform.baseVal.consolidate().matrix;// берём коорды каждого блка (consolidate = упорядочивание)
        const bBox = block.getBBox(); // получаем коорды блока 

        const bx = m.e; 
        const by = m.f;

        // расстояние между правым краем одного и левым краем другого
        const dx = Math.abs((selX + selBBox.width) - bx); // расстояние между правым краем выбранного блока и левым краем др блока 
        const dy = Math.abs((selY + selBBox.height / 2) - (by + bBox.height / 2)); // расстояние по вертикали между центрими блоков 

        // если достаточно близко — прилипает
        if (dx < 100 && dy < 100) { // если блоки достаточно близко то липнут 
            const snapX = bx - selBBox.width; // от bx минус кооды стенок блока 
            const snapY = by; // same 
 
            selected.setAttribute(
                'transform',
                `translate(${snapX}, ${snapY})`
            ); // перемещаем 
        }
    });

    // база 
    selected.style.cursor = 'grab';
    selected = null;
});

// e - типо event  

// тут у нас обращение к canvas то есть это рабаотет только для самох блоков типо когда moseup 
canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block')) // проверка что мы кликнули не просто на canvas облатсь, а неа canvas c
    //class block(который присваиватеся про создании блока ) 
        return;

    e.preventDefault(); // чтобы тект не выделялся(крч стандарт браузере убераем)

    selected = e.target; // устанавливаем selected на нащ выбранный блок 

    const rect = canvas.getBoundingClientRect(); // получаем данные чреез rect(1000000 раз писал)

    const matrix = selected.transform.baseVal.consolidate().matrix; // baseVal это список всех трансформаций 
    // consolidate - превращает все трансформаци в одну матрицу в одно числор x y 

    // посчитали корды а точнее сдвиг, то есть курсор остётся там же где и нажали 
    offsetX = e.clientX - rect.left - matrix.e; // matrix.e - x  ь
    offsetY = e.clientY - rect.top - matrix.f;  // matrix.f - y 

    // на сколько мышь смещена по x и y (чтобы блок не прыгал) ^
    selected.style.cursor = 'grabbing';
})












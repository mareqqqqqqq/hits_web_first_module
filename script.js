const canvas = document.getElementById('canvas');
let selected = null; // текущий выбранный блок 
let offsetX = 0; 
let offsetY = 0; 
let connections = [];

//DONE!!!!!!!!!!!
function createBlock(x, y, color, id, data_type) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path"); // обтект svg 

    // исходя из переданного типа блока присваеваем ему стили 
    if (data_type === "varuable_block") {
        // создание svg M0,0 старт h80 гор прямая итд d - атрибут для создания 
        path.setAttribute("d", "M0,0 v15 l10,10 v15 l-10,10 v10 h20 l10,10 h20 l10,-10     h40      v-10 l10,-10 v-15 l-10,-10  v-15 Z");
    }

    if (data_type === "assignment_block") {
        path.setAttribute("d", "M0,0 v50 h60 v-50 h-10 l-10,10 h-20 l-10,-10 Z");
    }

    path.setAttribute("fill", color); // заливка color как параметр
    path.setAttribute("transform", `translate(${x},${y})`); // куда сдвигаем svgшку
    path.setAttribute("id", id); // присваивает уникальный id короче(для дибилдо): он там ниже генерится в ф-ии где вызывается
    path.classList.add("block"); // добавляет клаасс block к svg тчоб можно было обратиться 

    if (data_type === "assignment_block") {
        path.dataset.pizdaTop = "true";
        path.dataset.pizdaLeft = "false";
        path.dataset.pizdaRight = "fasle";
        path.dataset.pizdaBottom = "false"; 

        path.dataset.pipkaTop = "false";
        path.dataset.pipkaLeft = "false";
        path.dataset.pipkaRight = "false";
        path.dataset.pipkaBottom = "false"; 
    }

    else if (data_type === "varuable_block") {
        path.dataset.pizdaTop = "false";
        path.dataset.pizdaLeft = "true";
        path.dataset.pizdaRight = "false";
        path.dataset.pizdaBottom = "false";

        path.dataset.pipkaTop = "false";
        path.dataset.pipkaLeft = "false";
        path.dataset.pipkaRight = "true";
        path.dataset.pipkaBottom = "true"; 
    }

    else {
        path.dataset.pizdaTop = "true";
        path.dataset.pizdaLeft = "false";
        path.dataset.pizdaRight = "fasle";
        path.dataset.pizdaBottom = "false"; 

        path.dataset.pipkaTop = "false";
        path.dataset.pipkaLeft = "false";
        path.dataset.pipkaRight = "false";
        path.dataset.pipkaBottom = "false";
    }

    canvas.appendChild(path); // добавляет path в svg html

    return path;
}

// создалт перемнную sidebarblocks котрая включает все наши div блоки потом чтобы ко всем обращаться 
const sidebarBlocks = document.querySelectorAll (
    '.varuable_block, .for_cycle_block, .other_block, .assignment_block' 
);

const varuable_block_dirca = document.querySelectorAll (
    '.varuable_block'
)


// DONE !!!!!!!
// для всех сайдбар блоков указываем действия для маус даун
sidebarBlocks.forEach(el => { // el - это элемент по которому кликнули   
    el.addEventListener('mousedown', e => { // когда событие маусдаун
        e.preventDefault(); 

        // задаём цвета для дивов, свг блоков, на самом деле
        const color = 
            el.classList.contains('for_cycle_block') ? '#2196f3' :
            el.classList.contains('other_block') ? '#ff9800' :
            el.classList.contains('assignment_block') ? '#494bd4' :
            el.classList.contains('varuable_block') ? 'rgb(76, 94, 170)' :
            '#4caf50';

    
            // получится обьект с полями: left top wigth height 
            const rect = canvas.getBoundingClientRect(); // возвращает позицию и размеры элемента на стринцу в px
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;

            let path = null; 

            if (el.classList.contains("assignment_block")) {
                // вызвали функцю(создался блок) также сохранили path(сам блок) чтобы дальше юзадть
                path = createBlock(x, y, color, 'block_' + Date.now(), "assignment_block");    
            }

            else if (el.classList.contains("varuable_block")) {
                // вызвали функцю(создался блок) также сохранили path(сам блок) чтобы дальше юзадть
                path = createBlock(x, y, color, 'block_' + Date.now(), "varuable_block");    
            }

            else {
                path = createBlock(x, y, color, 'block_' + Date.now(), "varuable_block");
            }

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
// перетаскивание блока 
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

       
        const dxRight = Math.abs((selX + selBBox.width) - bx - selBBox.width - selBBox.width);
        
        // selected слева от блок
        const dxLeft = Math.abs((selX + selBBox.width) - bx);

        // расстояние по вертикали (центры)

        const dy = Math.abs((selY - selBBox.height / 2) - (by - bBox.height / 2));

        const dxVer = Math.abs((selX - selBBox.width / 2) - (bx - bBox.width / 2));
        const dyVer = Math.abs(selY - (by + bBox.height));

        const hasRightChild = connections.some(conn => 
            conn.parent === block.id && conn.position === 'right'
        );
        
        // есть ли у блока ребенок СЛЕВА
        const hasLeftChild = connections.some(conn => 
            conn.parent === block.id && conn.position === 'left'
        );

        const hasVerticalChild = connections.some(conn =>
           conn.parent === block.id && conn.direction === 'vertical'
        );

        // есть ли блок в том месте, куда хотим встать
        const wouldSnapXRight = bx + bBox.width - 10;
        const wouldSnapXLeft = bx - selBBox.width + 10;
        
        // поверяем, не занято ли место справа
        const isSpaceRightTaken = blocks.some(otherBlock => {
            const otherPos = getBlockPos(otherBlock);
            return Math.abs(otherPos.x - wouldSnapXRight) < 5 && 
                   Math.abs(otherPos.y - by) < 5;
        });
        
        // проверяем, не занято ли место слева
        const isSpaceLeftTaken = blocks.some(otherBlock => {
            const otherPos = getBlockPos(otherBlock);
            return Math.abs(otherPos.x - wouldSnapXLeft) < 5 && 
                   Math.abs(otherPos.y - by) < 5;
        });

        // 
        if (dxRight < 40 && dy < 40 && 
            block.dataset.pipkaRight === "true" && 
            selected.dataset.pizdaLeft === "true" && 
            !hasRightChild && 
            !isSpaceRightTaken)  // 
        {
            const snapX = bx + bBox.width - 10;
            const snapY = by;
            
            selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);
            
            connections.push({
                parent: block.id,
                child: selected.id,
                position: 'right'
            });
        }
        
        // 
        else if (dxLeft < 40 && dy < 40 && 
                 block.dataset.pizdaLeft === "true" && 
                 selected.dataset.pipkaRight === "true" && 
                 !hasLeftChild && 
                 !isSpaceLeftTaken)  //
        {
            const snapX = bx - selBBox.width + 10;
            const snapY = by;
            
            selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);
            
            connections.push({
                parent: block.id,
                child: selected.id,
                position: 'left'
            });
        }

        else if (dxVer < 40 && dyVer < 40 && 
            !hasVerticalChild && selected.dataset.pizdaTop === "true"
             && block.dataset.pipkaBottom === "true") {
            const snapX = bx + 10; 
            const snapY = by + bBox.height - 11; 

            selected.setAttribute('transform', `translate(${snapX}, ${snapY})`);

            connections.push({
                parent: block.id,
                child: selected.id,
                direction: 'vertical'
            });
        }
    });

    selected.style.cursor = 'grab';
    selected = null;
});

// 
function getBlockPos(block) {
    const matrix = block.transform.baseVal.consolidate().matrix;
    return { x: matrix.e, y: matrix.f };
}

// e - типо event  

// тут у нас обращение к canvas то есть это рабаотет только для самох блоков типо когда moseup 
canvas.addEventListener('mousedown', e => {
    if (!e.target.classList.contains('block')) // проверка что мы кликнули не просто на canvas облатсь, а неа canvas c
    //class block(который присваиватеся про создании блока ) 
        return;

    const blockId = e.target.id; 

    connections = connections.filter(conn => 
        conn.parent != blockId && conn.child != blockId
    );

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


// класс для ввода в output
function addLine (text, type = "output"){
    const body = document.getElementById("outputBody");

    const div = document.createElement("div");
    div.className = "line " + type;
    div.textContent = text;

    body.insertBefore(div, body.lastElementChild);
    body.scrollTop = body.scrollHeight;
}

setTimeout(()=> addLine("Programm is finished", "output"), 1500);

//Очистка воркспейса
const clearButton = document.getElementById("clearContentButton");

clearButton.addEventListener("click", () =>{ 
    const blocks = canvas.querySelectorAll(".block");

    blocks.forEach(block => {

        const matrix = block.transform.baseVal.consolidate().matrix;

        const x = matrix.e;
        const y = matrix.f;

        block.setAttribute(
            "transform",
            `translate(${x}, ${y}) scale(0.8)`
        );

        block.classList.add("clear");
    });

    setTimeout(() => {
        canvas.replaceChild();
        selected = null;
    }, 300);
 });


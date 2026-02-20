const canvas = document.getElementById('canvas');
let selected = null; // текущий выбранный блок 
let offsetX = 0; 
let offsetY = 0; 
let connections = [];

// создалт перемнную sidebarblocks котрая включает все наши div блоки потом чтобы ко всем обращаться 
const sidebarBlocks = document.querySelectorAll (
    '.varuable_block, .else_block, .if_block, .assignment_block, .output_block, .arif_block, .cycle_block, .start_block, .endif_block, .endelse_block, .array_block' 
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
            el.classList.contains('if_block') ? '#ffac3e' :
            el.classList.contains('else_block') ? '#fd4a4a' :
            el.classList.contains('assignment_block') ? '#4e4fbe' :
            el.classList.contains('varuable_block') ? 'rgb(76, 94, 170)' :
            el.classList.contains('output_block') ? '#a3a669' :
            el.classList.contains('arif_block') ? '#5caeb9' :
            el.classList.contains('cycle_block') ? '#0066ff' :
            el.classList.contains('start_block') ? '#25c733' :
            el.classList.contains('endif_block') ? '#ffac3e' :
            el.classList.contains('endelse_block') ? '#fd4a4a' :
            el.classList.contains('array_block') ? '#004af7' :
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

            else if (el.classList.contains("if_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "if_block");
            }


            else if (el.classList.contains("else_block"))
            {
                path = createBlock(x, y, color, 'block_' + Date.now(), "else_block");
            }

            else if (el.classList.contains("output_block"))
            {
                path = createBlock(x, y, color, 'block_' + Date.now(), "output_block");
            }

            else if (el.classList.contains("arif_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "arif_block");
            }

            else if (el.classList.contains("cycle_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "cycle_block");
            }

            else if (el.classList.contains("start_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "start_block");
            }

            else if (el.classList.contains("endif_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "endif_block");
            }

            else if (el.classList.contains("endelse_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "endelse_block");
            }

            else if (el.classList.contains("array_block")){
                path = createBlock(x, y, color, 'block_' + Date.now(), "array_block");
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

const SNAP_OVERLAP = 10; 

function addConnection(parentId, childId, pos, parentType, childType) {
    if (!connections.some(c => c.parent === parentId && c.child === childId)) {
        connections.push({ parent: parentId, child: childId, position: pos, parent_block_type: parentType, child_block_type: childType});
    }
}

canvas.addEventListener('mouseup', () => {
    if (!selected) return;

    const selBox = selected.getBBox(); 
    const selPos = getBlockPos(selected); 
    const allBlocks = Array.from(canvas.querySelectorAll('.block')); 

    const isConnectorFree = (blockId, position) => !connections.some(c => c.parent === blockId && c.position === position);
    const isInputFree = (blockId, position) => !connections.some(c => c.child === blockId && c.position === position);

    let snapped = false;

    for (let block of allBlocks) {
        if (block === selected || snapped) continue;

        const bBox = block.getBBox();
        const bPos = getBlockPos(block);


        const dxVer = Math.abs(selPos.x - bPos.x); 
        if (dxVer < 50) {
            const targetYBottom = bPos.y + bBox.height - SNAP_OVERLAP; 
            const targetYTop = bPos.y - selBox.height + SNAP_OVERLAP;

            // магнитим СНИЗУ 
            if (Math.abs(selPos.y - targetYBottom) < 50 && 
                selected.dataset.connectionTop === "true" && 
                block.dataset.connectorBottom === "true" &&
                isConnectorFree(block.id, "vertical") && 
                isInputFree(selected.id, "vertical")) {
                
                selected.setAttribute('transform', `translate(${bPos.x}, ${targetYBottom})`);
                addConnection(block.id, selected.id, 'vertical', block.dataset.data_type, selected.dataset.data_type); 
                snapped = true;
            } 

            else if (Math.abs(selPos.y - targetYTop) < 50 && 
                     selected.dataset.connectorBottom === "true" && 
                     block.dataset.connectionTop === "true" &&
                     isConnectorFree(selected.id, "vertical") && 
                     isInputFree(block.id, "vertical")) {
                
                selected.setAttribute('transform', `translate(${bPos.x}, ${targetYTop})`);
                addConnection(selected.id, block.id, 'vertical', selected.dataset.data_type, block.dataset.data_type);
                snapped = true;
            }
        }

        if (snapped) break;

        const dyHor = Math.abs(selPos.y - bPos.y);
        if (dyHor < 50) {
            const targetXRight = bPos.x + bBox.width - SNAP_OVERLAP;
            const targetXLeft = bPos.x - selBox.width + SNAP_OVERLAP;


            if (Math.abs(selPos.x - targetXRight) < 50 && 
                selected.dataset.connectionLeft === "true" && 
                block.dataset.connectorRight === "true" &&
                isConnectorFree(block.id, 'horizontal') && 
                isInputFree(selected.id, 'horizontal')) {
                
                selected.setAttribute('transform', `translate(${targetXRight}, ${bPos.y})`);
                addConnection(block.id, selected.id, 'horizontal', block.dataset.data_type, selected.dataset.data_type);
                snapped = true;
            }

            else if (Math.abs(selPos.x - targetXLeft) < 50 && 
                     selected.dataset.connectorRight === "true" && 
                     block.dataset.connectionLeft === "true" &&
                     isConnectorFree(selected.id, 'horizontal') && 
                     isInputFree(block.id, 'horizontal')) {
                
                selected.setAttribute('transform', `translate(${targetXLeft}, ${bPos.y})`);
                addConnection(selected.id, block.id, 'horizontal', selected.dataset.data_type, block.dataset.data_type);
                snapped = true;
            }
        }
    }

    selected.style.cursor = 'grab';
    selected = null;
});



function getBlockPos(block) {
    const matrix = block.transform.baseVal.consolidate().matrix;
    return { x: matrix.e, y: matrix.f };
}

// e - типо event  

// тут у нас обращение к canvas то есть это рабаотет только для самох блоков типо когда moseup 
canvas.addEventListener('mousedown', e => {
    // if (!e.target.classList.contains('block')) // проверка что мы кликнули не просто на canvas облатсь, а неа canvas c
    // //class block(который присваиватеся про создании блока ) 
    //     return;

    const block = e.target.closest('.block'); 
    if (!block) return; 

    canvas.appendChild(block);

    const blockId = block.id; 

    connections = connections.filter(conn => 
        conn.parent !== blockId && conn.child !== blockId
    );

    e.preventDefault(); // чтобы тект не выделялся(крч стандарт браузере убераем)

    selected = block; // устанавливаем selected на нащ выбранный блок 

    const rect = canvas.getBoundingClientRect(); // получаем данные чреез rect(1000000 раз писал)

    const matrix = selected.transform.baseVal.consolidate().matrix; // baseVal это список всех трансформаций 
    // consolidate - превращает все трансформаци в одну матрицу в одно числор x y 

    // посчитали корды а точнее сдвиг, то есть курсор остётся там же где и нажали 
    offsetX = e.clientX - rect.left - matrix.e; // matrix.e - x  ь
    offsetY = e.clientY - rect.top - matrix.f;  // matrix.f - y 

    // на сколько мышь смещена по x и y (чтобы блок не прыгал) ^
    selected.style.cursor = 'grabbing';
})


// дбавил trash_bin(для css-ера)
const trash_bin = document.getElementById('trash_bin');
// анимация тряски
trash_bin.addEventListener("mouseenter", () => {
    trash_bin.classList.add("shaking");
});

trash_bin.addEventListener("mouseleave", () => {
    trash_bin.classList.remove("shaking");
});

trash_bin.addEventListener('mouseup', e => {
    if (!selected) return; 

    const block_id = selected.id; 
     
    // фильтруем и удаляем 
    connections = connections.filter(conn => // conn - каждый отдельный обьект в масииве 
        conn.parent !== block_id && conn.child !== block_id // крч это как фильтр он оставляет только те где прокатывает условие 
    );

    selected.remove(); 
    selected = null; 
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

//Очистка воркспейса sdfsdf
const clearButton = document.getElementById("clearContentButton");

clearButton.addEventListener("click", () => { 
    const blocks = canvas.querySelectorAll(".block");
    
    if (blocks.length === 0) return;

    blocks.forEach(block => {
        const matrix = block.transform.baseVal.consolidate().matrix;
        const x = matrix.e;
        const y = matrix.f;

        block.setAttribute("transform", `translate(${x}, ${y}) scale(0.8)`);
        block.classList.add("clear");
    });

    setTimeout(() => {
        blocks.forEach(block => {
            if (block.parentNode) {
                block.remove(); 
            }
        });
        
        connections = []; 
        selected = null; 
    }, 300);
});


window.script = this; 

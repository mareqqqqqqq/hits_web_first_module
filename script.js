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


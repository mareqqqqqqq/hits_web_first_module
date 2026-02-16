function createBlock(x, y, color, id, data_type) {
    const ns = "http://www.w3.org/2000/svg";
    const group = document.createElementNS(ns, "g"); // обтект svg 
    const path = document.createElementNS(ns, "path");

    // вот тут поменяли 
    // вот тут поменяли 
    group.classList.add("block"); 
    group.setAttribute("fill", color); // заливка color как параметр
    group.setAttribute("transform", `translate(${x},${y})`); // куда сдвигаем svgшку
    group.setAttribute("id", id); // присваивает уникальный id короче(для дибилдо): он там ниже генерится в ф-ии где вызывается
    group.classList.add("block"); // добавляет клаасс block к svg тчоб можно было обратиться 
    group.dataset.data_type = data_type;

    // устиановл стили для блоков от лёхи 
    // устиановл стили для блоков от лёхи 
    if (data_type === "varuable_block") {    //прямоугольник h100 v60 h -100 Z
        // создание svg M0,0 старт h80 гор прямая итд d - атрибут для создания 
        path.setAttribute("d", "M0,0 h100         v10 l10,10 v25 l-10,10 v10       h-45  l-10,10 h-25 l-10,-10 h-10     v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "assignment_block") { //прямоульник h65 v50 h-65 Z
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h10 v50 h-65 Z");
        }
    
    if (data_type === "if_block") { //прямоугольник h100 v60 h -100 Z 
          path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h100    v60 h-100 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "else_block") {
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v10 l10,10 v25 l-10,10 v10 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "then_block"){
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v10 l10,10 v25 l-10,10 v10 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }
    
    if (data_type === "output_block") { //прямоугольник h100 v60 h -100 Z
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45    v60 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "connector_block")
    {
        path.setAttribute("d", "M0,0 v230 h10 l10,10 h25 l10,-10 h10 h130 v-65 h-125  v-100 h115  v-10 l10,-10 v-25 l-10,-10 v-10  Z");
    }

    if (data_type === "else_block") {
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v10 l10,10 v25 l-10,10 v10 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "then_block"){
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v10 l10,10 v25 l-10,10 v10 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }
    
    if (data_type === "output_block") { //прямоугольник h100 v60 h -100 Z
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45    v60 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    // sdfsdfsdsdfsdf
    group.appendChild(path);
    
    if (data_type === "varuable_block") {

               //добавляем стили для норомального скрола
       if (!document.getElementById('custom-scroll-style')){
        const style = document.createElement('style');
        style.id = 'custom-scroll-style';
        style.textContent = `
            div[contenteditable = "true"]::-webkit-scrollbar {
            width: 4px;
            height: 4px;
            }
             div[contenteditable = "true"]::-webkit-scrollbar-track {
             background: #F1F1F1;
             border-radius: 10px;
             }
              div[contenteditable = "true"]::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 10px;
              }
               div[contenteditable = "true"]::-webkit-scrollbar-thumb:hover {
               background: #a8a8a8;
               }
                div[contenteditable = "true"] {
                scrollbar-width: thin;
                scrollbar-color: #c1c1c1 #f1f1f1;
                }
                `;
                document.head.appendChild(style);
       }

        // вроде как создание формы для двух блоков приписали 
        const foreign = document.createElementNS(ns, "foreignObject"); 

        foreign.setAttribute("x", 20);
        foreign.setAttribute("y", 20);
        foreign.setAttribute("width", 70);
        foreign.setAttribute("height", 25 );

        const div = document.createElement("div");
        div.setAttribute("contenteditable", "true");
        
        div.style.width = "100%";
        div.style.height = "100%"; 
        div.style.border = "none"; 
        div.style.outline = "none";
        div.style.background = "rgba(255, 255, 255, 0.9)";
        div.style.color = "black";
        div.style.fontFamily = "Inter";
        div.style.fontSize = "12px";
        div.style.textAlign = "left";
        div.style.overflowX = "auto";
        div.style.overflowY = "hidden";
        div.style.whiteSpace = "nowrap";
        div.style.padding = "2px 4px";
        div.style.boxSizing = "border-box";

        div.style.color = "#aaa";
        div.textContent = "Переменная";


        div.addEventListener("focus", function() {
            if (this.textContent === "Переменная") {
                this.textContent = "";
                this.style.color = "black";
            }
        });

        div.addEventListener("input", function(e) {
            if (e.target.textContent.trim() !== "") {
                e.target.style.color = "black";
            }
        });

        div.addEventListener("blur", function() {
            if (this.textContent.trim() === "") {
                this.textContent = "Переменная";
                this.style.color = "#aaa";
            }
        });


        div.addEventListener("mousedown", e => {
            e.stopPropagation();
        });

        foreign.appendChild(div); 
        group.appendChild(foreign);
    }

        if (data_type === "assignment_block") {
       //добавляем стили для норомального скрола
       if (!document.getElementById('custom-scroll-style')){
        const style = document.createElement('style');
        style.id = 'custom-scroll-style';
        style.textContent = `
            div[contenteditable = "true"]::-webkit-scrollbar {
            width: 4px;
            height: 4px;
            }
             div[contenteditable = "true"]::-webkit-scrollbar-track {
             background: #F1F1F1;
             border-radius: 10px;
             }
              div[contenteditable = "true"]::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 10px;
              }
               div[contenteditable = "true"]::-webkit-scrollbar-thumb:hover {
               background: #a8a8a8;
               }
                div[contenteditable = "true"] {
                scrollbar-width: thin;
                scrollbar-color: #c1c1c1 #f1f1f1;
                }
                `;
                document.head.appendChild(style);
       }
       
            // вроде как создание формы для двух блоков приписали 
        const foreign = document.createElementNS(ns, "foreignObject"); 

        foreign.setAttribute("x", 8);
        foreign.setAttribute("y", 20);
        foreign.setAttribute("width", 50);
        foreign.setAttribute("height", 25 );

        const div = document.createElement("div");
        div.setAttribute("contenteditable", "true");
        
        div.style.width = "100%";
        div.style.height = "100%"; 
        div.style.border = "none"; 
        div.style.outline = "none";
        div.style.background = "rgba(255, 255, 255, 0.9)";
        div.style.color = "black";
        div.style.fontFamily = "Inter";
        div.style.fontSize = "12px";
        div.style.textAlign = "left";
        div.style.overflowX = "auto";
        div.style.overflowY = "hidden";
        div.style.whiteSpace = "nowrap";
        div.style.padding = "2px 4px";
        div.style.boxSizing = "border-box";

        div.style.color = "#aaa";
        div.textContent = "Присвоить:";


        div.addEventListener("focus", function() {
            if (this.textContent === "Присвоить:") {
                this.textContent = "";
                this.style.color = "black";
            }
        });

        div.addEventListener("input", function(e) {
            if (e.target.textContent.trim() !== "") {
                e.target.style.color = "black";
            }
        });

        div.addEventListener("blur", function() {
            if (this.textContent.trim() === "") {
                this.textContent = "Присвоить:";
                this.style.color = "#aaa";
            }
        });


        div.addEventListener("mousedown", e => {
            e.stopPropagation();
        });

        foreign.appendChild(div); 
        group.appendChild(foreign);
    }


    
    if (data_type === "assignment_block") {
        group.dataset.pizdaTop = "true";
        group.dataset.pizdaLeft = "false";
        group.dataset.pizdaRight = "false";
        group.dataset.pizdaBottom = "false"; 

        group.dataset.pipkaTop = "false";
        group.dataset.pipkaLeft = "false";
        group.dataset.pipkaRight = "false";
        group.dataset.pipkaBottom = "false"; 
    }

    else if (data_type === "varuable_block") {
        group.dataset.pizdaTop = "false";
        group.dataset.pizdaLeft = "true";
        group.dataset.pizdaRight = "false";
        group.dataset.pizdaBottom = "false";

        group.dataset.pipkaTop = "false";
        group.dataset.pipkaLeft = "false";
        group.dataset.pipkaRight = "true";
        group.dataset.pipkaBottom = "true"; 
    }


    else if (data_type === "then_block" || data_type === "else_block")
    {
        group.dataset.pizdaTop = "true";
        group.dataset.pizdaLeft = "false";
        group.dataset.pizdaRight = "false";
        group.dataset.pizdaBottom = "false";

        group.dataset.pipkaTop = "false";
        group.dataset.pipkaLeft = "false";
        group.dataset.pipkaRight = "true";
        group.dataset.pipkaBottom = "true"; 
    }
    
    else if (data_type === "output_block" || data_type === "if_block" )
    {
        group.dataset.pizdaTop = "true";
        group.dataset.pizdaLeft = "false";
        group.dataset.pizdaRight = "false";
        group.dataset.pizdaBottom = "false";

        group.dataset.pipkaTop = "false";
        group.dataset.pipkaLeft = "false";
        group.dataset.pipkaRight = "false";
        group.dataset.pipkaBottom = "true"; 
    }

    else if (data_type === "connector_block")
    {
        group.dataset.pizdaTop = "false";
        group.dataset.pizdaLeft = "false";
        group.dataset.pizdaRight = "false";
        group.dataset.pizdaBottom = "false";

        group.dataset.pipkaTop = "false";
        group.dataset.pipkaLeft = "false";
        group.dataset.pipkaRight = "true";
        group.dataset.pipkaBottom = "true";
    }

    canvas.appendChild(group); // добавляет path в svg html

    return group;
}

window.createBlock = createBlock; 

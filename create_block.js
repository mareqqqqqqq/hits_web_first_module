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
          path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h165    v60 h-165 l-10,10 h-25 l-10,-10 h-10 Z");
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


    //Доработка блока if чтобы было 3 вариативных менюшек
    if (data_type === "if_block") {

        const operators = [">", "<", "=", "!=", ">=", "<="];
        const mockVariables = ["1", "2", "3"];

        function createValueSelector (x) {
            const foreign = document.createElementNS(ns, "foreignObject");
            foreign.setAttribute("x", x);
            foreign.setAttribute("y", 20);
            foreign.setAttribute("width", 70);
            foreign.setAttribute("height", 25);

            const container = document.createElement("div");
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.display = "flex";

            const select = document.createElement("select");
            select.style.width = "100%";
            select.style.height = "100%";
            select.style.fontSize = "12px";
            select.style.fontFamily = "Inter";
            select.style.background = "rgba(255, 255, 255, 0.9)";
            select.style.border = "none";
            select.style.outline = "none";

            mockVariables.forEach(v => {
                const option = document.createElement("option");
                option.value = v;
                option.textContent = v;
                select.appendChild(option);
            });

            const customOption = document.createElement("option");
            customOption.value = "custom";
            customOption.textContent = "Другое";
            select.appendChild(customOption);

            const input = document.createElement("input");
            input.type = "text";
            input.style.display = "none";
            input.style.width = "100%";
            input.style.height = "100%";
            input.style.fontSize = "12px";
            input.style.fontFamily = "Inter";
            input.style.border = "none";
            input.style.outline = "none";
            input.style.background = "rgba(255, 255, 255, 0.9)";
            input.placeholder = "Введите:";

            select.addEventListener("change", () => {
                if (select.value === "custom") {
                    select.style.display = "none";
                    input.style.display = "block";
                    input.focus();
                }
            });
    //при потере фокуса отрабаотывается
            input.addEventListener("blur", () => {
                if (input.value.trim() === "") {
                    input.style.display = "none";
                    select.style.display = "block";
                    select.value = mockVariables[0];
                }
            });

            select.addEventListener("mousedown", e => e.stopPropagation());
            input.addEventListener("mousedown", e => e.stopPropagation());
            foreign.addEventListener("mousedown", e => e.stopPropagation());

            container.appendChild(select);
            container.appendChild(input);
            foreign.appendChild(container);

            return foreign;
        }

        function createOperatorSelect(x) {
            const foreign = document.createElementNS(ns, "foreignObject");
            foreign.setAttribute("x", x);
            foreign.setAttribute("y", 20);
            foreign.setAttribute("width", 50);
            foreign.setAttribute("height", 25);

            const select = document.createElement("select");

            select.style.width = "100%";
            select.style.height = "100%";
            select.fontSize = "12px";
            select.style.fontFamily = "Inter";
            select.style.background = "rgba(255, 255, 255, 0.9)";
            select.style.border = "none";
            select.style.outline = "none";

            operators.forEach(op => {
                const option = document.createElement("option");
                option.value = op;
                option.textContent = op;
                select.appendChild(option);
            });

            select.addEventListener("mousedown", e => e.stopPropagation());

            foreign.appendChild(select);
            return foreign;
        }

        group.appendChild(createValueSelector(5, "Левое"));

        group.appendChild(createOperatorSelect(85));

        group.appendChild(createValueSelector(145, "Правое"));
    }

    
    if (data_type === "assignment_block") {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false"; 

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "false"; 
    }

    else if (data_type === "varuable_block") {
        group.dataset.connectionTop = "false";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true"; 
    }


    else if (data_type === "then_block" || data_type === "else_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true"; 
    }
    
    else if (data_type === "output_block" || data_type === "if_block" )
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "true"; 
    }

    else if (data_type === "connector_block")
    {
        group.dataset.connectionTop = "false";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true";
    }

    canvas.appendChild(group); // добавляет path в svg html

    return group;
}

window.createBlock = createBlock; 

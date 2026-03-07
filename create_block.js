function createBlock(x, y, color, id, data_type) {
        const ns = "http://www.w3.org/2000/svg";
        const group = document.createElementNS(ns, "g"); // обтект svg 
        const path = document.createElementNS(ns, "path");

        
        function createValueSelector (x, mode = "variable", allowCustom = true) {
                
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
                if (allowCustom === true) {
                    select.dataset.varuableSelectors = "true";
                }
                select.dataset.selectorType = mode;
                select.style.width = "100%";
                select.style.height = "100%";
                select.style.fontSize = "12px";
                select.style.fontFamily = "Inter";
                select.style.background = "rgba(255, 255, 255, 0.9)";
                select.style.border = "none";
                select.style.outline = "none";

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

            function createOperatorSelect(x, operators) {
                const foreign = document.createElementNS(ns, "foreignObject");
                foreign.setAttribute("x", x);
                foreign.setAttribute("y", 20);
                foreign.setAttribute("width", 50);
                foreign.setAttribute("height", 25);

                const select = document.createElement("select");

                select.style.width = "100%";
                select.style.height = "100%";
                select.style.fontSize = "12px";
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
        

            function createTextInput(x, placeholder) {
                const foreign = document.createElementNS(ns, "foreignObject");
                foreign.setAttribute("x", x);
                foreign.setAttribute("y", 20);
                foreign.setAttribute("width", 50);
                foreign.setAttribute("height", 25);

                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = placeholder;

                input.style.width = "100%";
                input.style.height = "100%";
                input.style.fontSize = "12px";
                input.style.fontFamily = "Inter";
                input.style.background = "rgba(255, 255, 255, 0.9)";
                input.style.border = "none";
                input.style.outline = "none";
                input.style.padding = "2px 4px";

                input.addEventListener("input", function() {
                    let value = this.value;
                    value = value.replace(/\s/g, "");
                    value = value.replace(/[^a-zA-Z0-9_]/g, "");
                    if(/^[0-9]/.test(value)) {
                        value = value.substring(1);
                    }
                    this.value = value;
                });

                input.addEventListener("mousedown", e => e.stopPropagation());
                foreign.appendChild(input);
                return foreign;
            }

                function createNumberInput(x, placeholder) {
                const foreign = document.createElementNS(ns, "foreignObject");
                foreign.setAttribute("x", x);
                foreign.setAttribute("y", 20);
                foreign.setAttribute("width", 50);
                foreign.setAttribute("height", 25);

                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = placeholder;

                input.style.width = "100%";
                input.style.height = "100%";
                input.style.fontSize = "12px";
                input.style.fontFamily = "Inter";
                input.style.background = "rgba(255, 255, 255, 0.9)";
                input.style.border = "none";
                input.style.outline = "none";
                input.style.padding = "2px 4px";

                input.addEventListener("input", function() {
                    let value = this.value;
                    value = value.replace(/[^0-9\-]/g, "");
                    if (value.includes("-")) {
                        value = "-" + value.replace(/-/g, "");
                    }
                    this.value = value;
                });

                input.addEventListener("mousedown", e => e.stopPropagation());
                foreign.addEventListener("mousedown", e => e.stopPropagation());
                foreign.appendChild(input);
                return foreign;
            }

            function addNumberWithSpace(x, placeholder) {
                const foreign = document.createElementNS(ns, "foreignObject");
                foreign.setAttribute("x", x);
                foreign.setAttribute("y", 20);
                foreign.setAttribute("width", 120);
                foreign.setAttribute("height", 25);

                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = placeholder;

                input.style.width = "100%";
                input.style.height = "100%";
                input.style.fontSize = "12px";
                input.style.fontFamily = "Inter";
                input.style.background = "rgba(255, 255, 255, 0.9)";
                input.style.border = "none";
                input.style.outline = "none";
                input.style.padding = "2px 4px";
                input.style.boxSizing = "border-box";

                input.addEventListener("input", function() {
                    let value = this.value;

                    value = value.replace(/[^0-9\- ]/g, "");
                    
                    let parts = value.split(" ");

                    parts = parts.map(part => {
                        if (part === "") return "";

                        let cleaned = part.replace(/-/g, "");
                        if (part.startsWith("-")) {
                            return "-" + cleaned;
                        }

                        return cleaned;
                    });

                    this.value = parts.join(" ");
                });

                input.addEventListener("mousedown", e => e.stopPropagation());
                foreign.addEventListener("mousedown", e => e.stopPropagation());

                foreign.appendChild(input);

                return foreign;
            }

                function createArraySelector (x) {
                
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

                if (ArrayName.length === 0) {
                    const option = document.createElement("option");
                    option.value = "";
                    option.textContent = "Нет массивов";
                    select.appendChild(option);
                }

                else {
                    ArrayName.forEach (item => {
                        const option = document.createElement("option");
                        option.value = item.array_name;
                        option.textContent = item.array_name;
                        select.appendChild(option);
                    });
                }

                select.addEventListener("mousedown", e => e.stopPropagation());
                foreign.addEventListener("mousedown", e => e.stopPropagation());

                container.appendChild(select);
                foreign.appendChild(container);

                return foreign;
            }

            function createInputSlot(x, slotName) {
                // выглядит как первая дырка у arif — foreignObject с белым фоном
                const foreign = document.createElementNS(ns, "foreignObject");
                foreign.setAttribute("x", x);
                foreign.setAttribute("y", 20);
                foreign.setAttribute("width", 80);
                foreign.setAttribute("height", 25);
                foreign.dataset.slot = slotName;
                foreign.dataset.occupied = "false";

                const div = document.createElement("div");
                div.style.width = "100%";
                div.style.height = "100%";
                div.style.background = "rgba(255,255,255,0.9)";
                div.style.border = "none";
                div.style.borderRadius = "2px";
                div.style.boxSizing = "border-box";

                foreign.addEventListener("mousedown", e => e.stopPropagation());
                foreign.appendChild(div);
                return foreign;
            }

            function createEqual(x) {
            const text = document.createElementNS(ns, "text");
            text.setAttribute("x", x);
            text.setAttribute("y", 37);
            text.setAttribute("fill", "white");
            text.setAttribute("font-size", "14");
            text.setAttribute("font-family", "Inter");
            text.setAttribute("font-weight", "bold");
            text.textContent = "=";

            text.addEventListener("mousedown", e => e.stopPropagation());

            return text;
        }
        
        // вот тут поменяли 
        // вот тут поменяли 
        // group.classList.add("block"); 
        group.setAttribute("fill", color); // заливка color как параметр
        group.setAttribute("transform", `translate(${x},${y})`); // куда сдвигаем svgшку
        group.setAttribute("id", id); // присваивает уникальный id короче(для дибилдо): он там ниже генерится в ф-ии где вызывается
        group.classList.add("block"); // добавляет клаасс block к svg тчоб можно было обратиться 
        group.dataset.data_type = data_type;

        // устиановл стили для блоков от лёхи 
        // устиановл стили для блоков от лёхи 
        if (data_type === "varuable_block") {    //прямоугольник h100 v60 h -100 Z
            // создание svg M0,0 старт h80 гор прямая итд d - атрибут для создания 
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45         v10 l10,10 v25 l-10,10 v10       h-45  l-10,10 h-25 l-10,-10 h-10  Z");
        }

    if (data_type === "assignment_block") { //прямоульник h65 v50 h-65 Z
        path.setAttribute("d", "M0,0 h65 v65 h-65 v-10 l10,-10 v-25 l-10,-10 v-10 Z");
        }
    
    if (data_type === "if_block") { //прямоугольник h100 v60 h -100 Z 
          path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h165    v10 l10,10 v25 l-10,10 v10     h-165 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "else_block") {
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v65 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "output_block") { //прямоугольник h100 v60 h -100 Z
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45    v65 h-45 l-10,10 h-25 l-10,-10 h-10  v-10 l10,-10 v-25 l-10,-10 Z");
    }

    if (data_type === "arif_block") { 
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h240 v10 l10,10 v25 l-10,10 v10 h-240 l-10,10 h-25 l-10,-10 h-10 v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "cycle_for_block") { 
       path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h375    v65  h-375 l-10,10 h-25 l-10,-10 h-10    v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }
    
    if (data_type === "start_block") {
            path.setAttribute("d", "M0,0 h235 v65  h-170 h-10 l-10,10 h-25 l-10,-10 h-10   Z");
    }

    if (data_type === "endif_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v65 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "endelse_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h45 v65 h-45 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "array_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h205 v65 h-205 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "array_index_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h130 v65 h-130 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "cycle_while_block") { 
       path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h175    v10 l10,10 v25 l-10,10 v10   h-175 l-10,10 h-25 l-10,-10 h-10    v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "logic_and_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h175    v10 l10,10 v25 l-10,10 v10   h-175 l-10,10 h-25 l-10,-10 h-10    v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "logic_or_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h175    v10 l10,10 v25 l-10,10 v10   h-175 l-10,10 h-25 l-10,-10 h-10    v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "logic_not_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h175    v10 l10,10 v25 l-10,10 v10   h-175 l-10,10 h-25 l-10,-10 h-10    v-10 l10,-10 v-25 l-10,-10 v-10 Z");
    }

    if (data_type === "endfor_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h375 v65 h-375 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "endwhile_block") {
            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h175 v65 h-175 l-10,10 h-25 l-10,-10 h-10 Z");
    }

    if (data_type === "input_arif_block") {
        path.setAttribute("d", "M0,0 h240 v40 h-240 Z");
        path.setAttribute("stroke", "#1a1a1a");
        path.setAttribute("stroke-width", "2");
        group.dataset.baseInnerW = "240";
        group.dataset.currentInnerW = "240";
    }

    group.appendChild(path);

    // input_arif_block: добавляем дочерние элементы ПОСЛЕ path, чтобы они рендерились поверх
    if (data_type === "input_arif_block") {
        group.appendChild(createInputSlot(5, "slot_left"));
        group.appendChild(createOperatorSelect(90, ["+", "-", "*", "//", "%"]));
        group.appendChild(createInputSlot(150, "slot_right"));
    }
    
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

        //Фильтрация ввода от некорректных названий
        div.addEventListener("input", function() {
            
            let text = div.textContent;

            text = text.replace(/\s/g, "");

            text = text.replace(/[^a-zA-Z0-9_]/g, "");

            if (/^[0-9]/.test(text)) {
                text = text.substring(1);
            }

            div.textContent = text;

            updateVaruable(group.id, text);

            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(div);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
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

        div.addEventListener("input", function() {

            let value = this.textContent;

            value = value.replace(/[^0-9\-]/g, "");

            if(value.includes("-")) {
                value = "-" + value.replace(/-/g, "");
            }

            this.textContent = value;

            const connection = connections.find(conn =>
                conn.child === group.id &&
                conn.parent_block_type === "varuable_block"
            );

            if (connection) {
                updateVaruableValue(connection.parent, value);
            }

            if (this.textContent.trim() !== "") {
                this.style.color = "black";
            }

            const selection = window.getSelection();
            const range = document.createRange();

            range.selectNodeContents(this);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        });

        div.addEventListener("keypress", function(e) {
            if (!/[0-9]/.test(e.key)) {
                if (e.key === "-" && this.textContent.length === 0) {
                    return;
                }
                e.preventDefault();
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

            path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h165    v10 l10,10 v25 l-10,10 v10     h-165 l-10,10 h-25 l-10,-10 h-10 Z");

            group.appendChild(createValueSelector(5, "variable", true));

            group.appendChild(createOperatorSelect(85, [">", "<", "=", "!=", ">=", "<="]));

            group.appendChild(createValueSelector(145, "variable", true));
        }


    //Для вариативного меню в аутпут блок

    if (data_type === "output_block") {
 

        group.appendChild(createValueSelector(15, "variable+array"));
    }

    if (data_type === "arif_block") {
        path.setAttribute("d", "M0,0 h10 l10,10 h25 l10,-10 h310 v65 h-310 l-10,10 h-25 l-10,-10 h-10 v-10 l10,-10 v-25 l-10,-10 v-10 Z");
        group.dataset.baseInnerW = "310";
        group.dataset.currentInnerW = "310";

        group.appendChild(createValueSelector(15, "variable", false));
        group.appendChild(createEqual(92));
        group.appendChild(createInputSlot(105, "slot_left"));
        group.appendChild(createOperatorSelect(195, ["+", "-", "*", "//", "%"]));
        group.appendChild(createInputSlot(253, "slot_right"));
    }

    if (data_type === "cycle_for_block") {



        group.appendChild(createTextInput(15, "cycle var"));
        group.appendChild(createEqual(65));
        group.appendChild(createNumberInput(75, "start cycle"));

        group.appendChild(createTextInput(140, "cycle var"));
        group.appendChild(createOperatorSelect(195, [">", "<", "=", "!=", ">=", "<="]));
        group.appendChild(createNumberInput(250, "end cycle"))

        group.appendChild(createOperatorSelect(315, ["+", "-", "*", "//"]));
        group.appendChild(createNumberInput(370, "cycle step"));
    }

    if (data_type === "cycle_while_block") {
        group.appendChild(createValueSelector(15));
        group.appendChild(createOperatorSelect(95, [">", "<", "=", "!=", ">=", "<="]));
        group.appendChild(createValueSelector(155))
    }

    if (data_type === "array_block") {
        const nameInput = createTextInput(15, "array name");
        const lenInput = createNumberInput(75, "array len");
        const elementsInput = addNumberWithSpace(135, "array element");

        const nameField = nameInput.querySelector("input");
        const lenField = lenInput.querySelector("input");
        const elementField = elementsInput.querySelector("input");

        nameField.addEventListener("input", () => updateArray(group.id));
        lenField.addEventListener("input", () => updateArray(group.id));
        elementField.addEventListener("input", () => updateArray(group.id));

        group.appendChild(nameInput);
        group.appendChild(lenInput);
        group.appendChild(elementsInput);
    }

    if (data_type === "array_index_block") {
        group.appendChild(createValueSelector(15));
        group.appendChild(createEqual(90));
        group.appendChild(createValueSelector(105));
    }

    if (data_type === "logic_and_block") {
            group.appendChild(createValueSelector(15));
            group.appendChild(createOperatorSelect(95, [">", "<", "=", "!=", ">=", "<="]));
            group.appendChild(createValueSelector(155));
    }

    if (data_type === "logic_or_block") {
        group.appendChild(createValueSelector(15));
        group.appendChild(createOperatorSelect(95, [">", "<", "=", "!=", ">=", "<="]));
        group.appendChild(createValueSelector(155));
}

    if (data_type === "logic_not_block") {
        group.appendChild(createValueSelector(15));
        group.appendChild(createOperatorSelect(95, [">", "<", "=", "!=", ">=", "<="]));
        group.appendChild(createValueSelector(155));
}
    
    if (data_type === "assignment_block") {
        group.dataset.connectionTop = "false";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false"; 

            group.dataset.connectorTop = "false";
            group.dataset.connectorLeft = "false";
            group.dataset.connectorRight = "false";
            group.dataset.connectorBottom = "false"; 
        }

        else if (data_type === "varuable_block") {
            group.dataset.connectionTop = "true";
            group.dataset.connectionLeft = "false";
            group.dataset.connectionRight = "false";
            group.dataset.connectionBottom = "false";

            group.dataset.connectorTop = "false";
            group.dataset.connectorLeft = "false";
            group.dataset.connectorRight = "true";
            group.dataset.connectorBottom = "true"; 
        }


        else if (data_type === "else_block")
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
        
        else if (data_type === "if_block" )
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

    else if (data_type === "arif_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "true";
    }

     else if (data_type === "output_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "true";
    }


    else if (data_type === "cycle_for_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "true"; 
    }

    else if (data_type === "cycle_while_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true"; 
    }

    else if (data_type === "start_block")
    {
        group.dataset.connectionTop = "false";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "true"; 
    }

    else if (data_type === "endif_block")
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

    else if (data_type === "endelse_block")
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

    else if (data_type === "array_block")
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

    else if (data_type === "array_index_block")
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

    else if (data_type === "logic_or_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true";
    }

    else if (data_type === "logic_and_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true"; 
    }

    else if (data_type === "logic_not_block")
    {
        group.dataset.connectionTop = "true";
        group.dataset.connectionLeft = "true";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "true";
        group.dataset.connectorBottom = "true"; 
    }


    else if (data_type === "endfor_block")
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

     else if (data_type === "endwhile_block")
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

    else if (data_type === "input_arif_block")
    {
        // input_arif_block не коннектится вертикально/горизонтально — только через слоты
        group.dataset.connectionTop = "false";
        group.dataset.connectionLeft = "false";
        group.dataset.connectionRight = "false";
        group.dataset.connectionBottom = "false";

        group.dataset.connectorTop = "false";
        group.dataset.connectorLeft = "false";
        group.dataset.connectorRight = "false";
        group.dataset.connectorBottom = "false";
        group.dataset.isInputArif = "true";
    }

        const viewport = document.getElementById('viewport');
        viewport.appendChild(group);// добавляет path в svg html

        refreshAllVariableSelectors();

        return group;
    }

    window.createBlock = createBlock;
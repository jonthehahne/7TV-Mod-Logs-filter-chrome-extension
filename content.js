(() => {
    const PANEL = ".seventv-mod-logs-panel";
    const CARD = ".seventv-mod-logs-card";
    const CHIP = ".seventv-mod-logs-chip";
    const TIME = ".seventv-mod-logs-time";
    const MESSAGE =".seventv-mod-logs-message";
    const MESSAGE_LIST =".seventv-mod-logs-message-list";
    
    const FILTER_CLASS = "modlog-filter-controls";

    function addControls(panel) {
        if (panel.querySelector(`.${FILTER_CLASS}`)) return;

        const list = panel.querySelector(".seventv-mod-logs-list");
        if (!list) return;

        const controls = document.createElement("div");
        controls.className = FILTER_CLASS;

        controls.innerHTML = `
            <select class="modlog-filter" aria-label="Filter type">
            <option value="all">All</option>
            <option value="ban">Bans</option>
            <option value="timeout">Timeouts</option>
        </select>

            <select class="modlog-sort" aria-label="Sort order">
            <option value="recent">Most Recent</option>
            <option value="worst">Worst</option>
        </select>

            <label class="modlog-switch">
            <input type="checkbox" id="modlog-filter-checkbox-show-one">
        </label>
            <label class="modlog-switch">
            <input type="checkbox" id="modlog-filter-checkbox-hide">
        </label>
        `;

        list.parentElement.insertBefore(controls, list);

        controls.addEventListener("change", applyFilters);

        applyFilters();
    }

    const time = function (number) {
        const int = parseFloat(number);
        if (number.endsWith("s") || number.endsWith("e")) {
            return int
        } else {
            return int * 60
        }
    }

    function applyFilters() {
        const panel = document.querySelector(PANEL);
        if (!panel) return;

        const controls = panel.querySelector(`.${FILTER_CLASS}`);
        if (!controls) return;

        const filter = controls.querySelector(".modlog-filter").value;
        const sort = controls.querySelector(".modlog-sort").value;

        panel.querySelectorAll(CARD).forEach(card => {
            const chip = card.querySelector(CHIP);

            const filterText = chip?.textContent.trim().toLowerCase() ?? "";

            const matchesFilter =
                filter === "all" ||
                (filter === "ban" && filterText.includes("ban")) ||
                (filter === "timeout" && filterText.includes("timeout"));

            card.dataset.modlogFilterHidden =
                String(!(matchesFilter));
        });

        const cb1 = document.getElementById("modlog-filter-checkbox-show-one");
        const cb0 = document.getElementById("modlog-filter-checkbox-hide");
        console.log(cb1.checked);

        



        const elements = Array.from(panel.querySelectorAll(CARD));
        const list = panel.querySelector(".seventv-mod-logs-list");

        if (sort==="worst") {
            elements.sort((a,b) => {
                const anum = parseFloat((a.querySelector(CHIP)?.textContent.trim() ?? '').replace(/[^0-9.\-]/g,''));
                const bnum = parseFloat((b.querySelector(CHIP)?.textContent.trim() ?? '').replace(/[^0-9.\-]/g,''));

                return bnum - anum
            });
            elements.forEach(item => list.appendChild(item));
        }

        if (sort=="recent") {
            elements.sort((a,b) => {
                const anum = time((a.querySelector(TIME)?.textContent.trim() ?? '').slice(0,4));
                const bnum = time((b.querySelector(TIME)?.textContent.trim() ?? '').slice(0,4));

                return anum - bnum
            });
            elements.forEach(item => list.appendChild(item));
            
        }

        if (cb1.checked) {
            elements.forEach(item => {
                const messages = item.querySelectorAll(MESSAGE);
                messages.forEach((message_item, index, array) => {
                    if (index === array.length - 1) return;
                    message_item.style.display="none";
                });
                console.log("looop");
            }
            );
            console.log("once");
        } else {
            elements.forEach(item => {
                const messages = item.querySelectorAll(MESSAGE);
                messages.forEach(message_item => {
                    message_item.style.display="";
                });
                console.log("looop");
            }
            );
            console.log("once");
        }
        if (cb0.checked) {
            elements.forEach(item => {
                const messages = item.querySelectorAll(MESSAGE);
                messages.forEach(message_item => {
                    message_item.style.display="none";
                });
                console.log("looop");
            }
            );
            console.log("once");
        } else {
            elements.forEach(item => {
                const messages = item.querySelectorAll(MESSAGE);
                messages.forEach(message_item => {
                    message_item.style.display="";
                });
                console.log("looop");
            }
            );
            console.log("once");
        }

        /* else {
            elements.sort((elementA, elementB) => {
                const timesinceA = elementA.
            })
        } */
        


    }

    function initialize() {
        const panel = document.querySelector(PANEL);
        if (panel) addControls(panel);
    }

    // Twitch and 7TV render their UI dynamically.
    const observer = new MutationObserver(initialize);

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    initialize();
})();
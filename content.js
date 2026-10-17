(() => {
    const PANEL = ".seventv-mod-logs-panel";
    const CARD = ".seventv-mod-logs-card";
    const CHIP = ".seventv-mod-logs-chip";
    const TIME = ".seventv-mod-logs-time";
    
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
            <input type="checkbox">
        </label>
        `;

        list.parentElement.insertBefore(controls, list);

        controls.addEventListener("change", applyFilters);

        applyFilters();
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

        const elements = [... panel.querySelectorAll(CARD)];
        const parentElement = panel.querySelector(".seventv-mod-logs-list");


        const collator = new Intl.Collator(undefined, {numeric: IsNumeric, sensitivity: 'base'});


        if (sort === "worst") {
            elements.sort((elementA, elementB) => {
                const timeoutvalueA = elementA.querySelector(CHIP).textContent.trim().slice(8, elementA.querySelector(CHIP).textContent().trim().length - 3);
                const timeoutvalueB = elementB.querySelector(CHIP).textContent.trim().slice(8, elementB.querySelector(CHIP).textContent().trim().length - 3);
                return timeoutvalueA - timeoutvalueB;
            })
            .forEach(element => parentElement.appendChild(element));
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
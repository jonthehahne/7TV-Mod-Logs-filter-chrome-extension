(() => {
    const PANEL = ".seventv-mod-logs-panel";
    const CARD = "-seventv-mod-logs-card";
    const CHIP = "-seventv-mod-logs-chip";
    const TARGET = "-seventv-mod-logs-target";
    
    const FILTER_CLASS = "modlog-filter-controls";

    function addControls(panel) {
        if (panel.querySelector(`.${FILTER_CLASS}`)) return;

        const list = panel.querySelector(".seventv-mod-logs-list");
        if (!list) return;

        const controls = document.createElement("div");
        controls.className = FILTER_CLASS;

        controls.innerHTML = `
            <select class="modlog-action" aria-label="Filter action type">
            <option value="all">All actions</option>
            <option value="ban">Bans</option>
            <option value="timeout">Timeouts</option>
        </select>

        <input
            class="modlog-search"
            type="search"
            placeholder="Search chatter..."
            aria-label="Search chatter"
        />
        `;

        list.parentElement.insertBefore(controls, list);

        controls.addEventListener("input", applyFilters);
        controls.addEventListener("change", applyFilters);

        applyFilters();
    }

    function applyFilters() {
        const panel = document.querySelector(PANEL);
        if (!panel) return;

        const controls = panel.querySelector(`.${FILTER_CLASS}`);
        if (!controls) return;

        const action = controls.querySelector(".modlog-action").value;
        const query = controls
            .querySelector(".modlog-search")
            .value.trim()
            .replace(/^@/, "")
            .toLowerCase();

        panel.querySelectorAll(CARD).forEach(card => {
            const chip = card.querySelector(CHIP);
            const target = card.querySelector(TARGET);

            const actionText = chip?.textContent.trim().toLowerCase() ?? "";
            const username = target?.textContent
                .trim()
                .replace(/^@/, "")
                .toLowerCase() ?? "";

            const matchesAction =
                action === "all" ||
                (action === "ban" && actionText.includes("ban")) ||
                (action === "timeout" && actionText.includes("timeout"));

            const matchesSearch = username.includes(query);

            card.dataset.modlogFilterHidden =
                String(!(matchesAction && matchesSearch));
        });
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
document.addEventListener("DOMContentLoaded", function () {
    // Ensure elements exist before adding event listeners
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);
                    localStorage.setItem("speedDialData", JSON.stringify(data));
                    setupTabs(data.record.groups, data.record.dials);
                } catch (error) {
                    console.error("Error parsing JSON file:", error);
                }
            };
            reader.readAsText(file);
        });
    }

    // Load bookmarks from JSONBin.io
    loadSavedData();
});

// Fetch JSON from JSONBin.io and update bookmarks
function loadSavedData() {
    fetch("https://api.jsonbin.io/v3/b/67bde15fad19ca34f811bd2d/latest")
        .then(response => response.json())
        .then(data => {
            if (data.record && data.record.groups && data.record.dials) {
                setupTabs(data.record.groups, data.record.dials);
            } else {
                console.error("JSON structure is incorrect:", data);
            }
        })
        .catch(error => console.error("Error loading bookmarks:", error));
}

// Set up tabs dynamically from JSON data
function setupTabs(groups, dials) {
    const tabWrapper = document.getElementById("tabWrapper");
    if (!tabWrapper) {
        console.error("Tab wrapper not found");
        return;
    }
    tabWrapper.innerHTML = "";

    groups.forEach((group, index) => {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.textContent = group.title;
        tab.dataset.groupId = group.id;
        tab.onclick = () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            displayBookmarks(dials.filter(dial => dial.idgroup === group.id));
        };

        tabWrapper.appendChild(tab);
    });

    if (groups.length > 0) {
        tabWrapper.children[0].classList.add("active");
        displayBookmarks(dials.filter(dial => dial.idgroup === groups[0].id));
    }
}

// Display bookmarks in the grid
function displayBookmarks(dials) {
    const grid = document.getElementById("bookmarkGrid");
    if (!grid) {
        console.error("Bookmark grid not found");
        return;
    }
    grid.innerHTML = "";

    dials.forEach(dial => {
        const div = document.createElement("div");
        div.className = "bookmark";

        const img = document.createElement("img");
        img.src = dial.thumbnail || "https://placehold.co/100x100";
        img.alt = dial.title;
        img.onerror = () => { img.src = "https://placehold.co/100x100"; };
        img.addEventListener("click", () => {
            window.open(dial.url, "_blank");
        });

        div.appendChild(img);
        grid.appendChild(div);
    });
}

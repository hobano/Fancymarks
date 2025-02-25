document.addEventListener("DOMContentLoaded", function () {
    loadSavedData();
});

document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = JSON.parse(e.target.result);
        localStorage.setItem("speedDialData", JSON.stringify(data)); // Save to localStorage
        setupTabs(data.groups, data.dials);
    };
    reader.readAsText(file);
});

document.getElementById("resetData").addEventListener("click", function () {
    localStorage.removeItem("speedDialData");
    document.getElementById("tabContainer").innerHTML = "";
    document.getElementById("bookmarkGrid").innerHTML = "";
});

function loadSavedData() {
    const savedData = localStorage.getItem("speedDialData");
    if (savedData) {
        const data = JSON.parse(savedData);
        setupTabs(data.groups, data.dials);
    }
}

function setupTabs(groups, dials) {
    const tabWrapper = document.getElementById("tabWrapper");
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

// Smooth scrolling for tabs
document.getElementById("tabLeftArrow").addEventListener("click", () => {
    document.getElementById("tabWrapper").scrollBy({ left: -200, behavior: "smooth" });
});

document.getElementById("tabRightArrow").addEventListener("click", () => {
    document.getElementById("tabWrapper").scrollBy({ left: 200, behavior: "smooth" });
});

function displayBookmarks(dials) {
    const grid = document.getElementById("bookmarkGrid");
    grid.innerHTML = "";

    dials.forEach(dial => {
        const div = document.createElement("div");
        div.className = "bookmark";

        const img = document.createElement("img");
        img.src = dial.thumbnail || "https://placehold.co/150x100";
        img.alt = dial.title;
        img.onerror = () => { img.src = "https://placehold.co/150x100"; };

        const link = document.createElement("a");
        link.href = dial.url;
        link.target = "_blank";
        link.textContent = dial.title;

        div.appendChild(img);
        div.appendChild(link);
        grid.appendChild(div);
    });
}
function displayBookmarks(dials) {
    const grid = document.getElementById("bookmarkGrid");
    grid.innerHTML = "";

    dials.forEach(dial => {
        const div = document.createElement("div");
        div.className = "bookmark";

        const img = document.createElement("img");
        img.src = dial.thumbnail || "https://placehold.co/150x100";
        img.alt = dial.title;
        img.onerror = () => { img.src = "https://placehold.co/150x100"; };
        img.addEventListener("click", () => {
            window.open(dial.url, "_blank");
        });

        div.appendChild(img);
        grid.appendChild(div);
    });
}

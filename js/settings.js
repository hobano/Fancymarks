document.getElementById("exportData").addEventListener("click", function () {
    const savedData = localStorage.getItem("speedDialData");
    if (!savedData) {
        alert("No data to export!");
        return;
    }

    const blob = new Blob([savedData], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speed-dial-export.json";
    link.click();
});

document.getElementById("importFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem("speedDialData", JSON.stringify(data));
            alert("Import successful! Return to the main page to see your bookmarks.");
        } catch (error) {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
});

document.getElementById("resetData").addEventListener("click", function () {
    if (confirm("Are you sure you want to reset all bookmarks? This cannot be undone.")) {
        localStorage.removeItem("speedDialData");
        alert("All bookmarks have been reset.");
    }
});

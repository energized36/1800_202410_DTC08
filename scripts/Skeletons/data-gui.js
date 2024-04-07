document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/data-gui.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("data-gui-holder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
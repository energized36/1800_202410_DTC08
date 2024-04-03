document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/homebar.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("homebarholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/navbar_home.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("tophomenav");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});


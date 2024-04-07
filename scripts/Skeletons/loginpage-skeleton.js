document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/login_nav.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("loginnav");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
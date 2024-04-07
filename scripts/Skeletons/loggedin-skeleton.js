document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/top_nav_bar_after_log_in.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("innavholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/top_nav_bar_before_log_in.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("topnavholder");

            elementToReplace.innerHTML = html;
            $("#Hamburger").on("click", () => {
                $('#dropdown').toggleClass("collapse");
            });
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
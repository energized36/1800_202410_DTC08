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

document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/top_nav_bar_after_log_in.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("innavholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/login_nav.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("loginnav");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/footer.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("footerholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/homebar.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("homebarholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/navbar_home.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("tophomenav");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});


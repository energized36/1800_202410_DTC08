document.addEventListener("DOMContentLoaded", function () {
    fetch('./texts/footer.html')
        .then(response => response.text())
        .then(html => {
            var elementToReplace = document.getElementById("footerholder");

            elementToReplace.innerHTML = html;
        })
        .catch(error => console.error('Error fetching new HTML:', error));
});
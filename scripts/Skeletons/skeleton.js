/**
 * Loads the home navigation bar HTML content when the DOM is fully loaded.
 * 
 * This function listens for the 'DOMContentLoaded' event which is fired when the initial HTML document has been completely loaded and parsed.
 * It then fetches the 'navbar_home.html' file from the 'texts' directory.
 * If the fetch is successful, it replaces the inner HTML of the element with id 'tophomenav' with the fetched HTML.
 * If there is an error during the fetch, it logs the error to the console.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the 'navbar_home.html' file from the 'texts' directory
    fetch('./texts/navbar_home.html')
        .then(response => {
            // Convert the response to text
            return response.text();
        })
        .then(html => {
            // Get the element with id 'tophomenav'
            var elementToReplace = document.getElementById("tophomenav");

            // Replace the inner HTML of the element with the fetched HTML
            elementToReplace.innerHTML = html;
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error fetching new HTML:', error);
        });
});
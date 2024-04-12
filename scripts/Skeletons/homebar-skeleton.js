/**
 * Loads the homebar HTML content when the DOM is fully loaded.
 * 
 * This function listens for the 'DOMContentLoaded' event which is fired when the initial HTML document has been completely loaded and parsed.
 * It then fetches the 'homebar.html' file from the 'texts' directory.
 * If the fetch is successful, it replaces the inner HTML of the element with id 'homebarholder' with the fetched HTML.
 * If there is an error during the fetch, it logs the error to the console.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the 'homebar.html' file from the 'texts' directory
    fetch('./texts/homebar.html')
        .then(response => {
            // Convert the response to text
            return response.text();
        })
        .then(html => {
            // Get the element with id 'homebarholder'
            var elementToReplace = document.getElementById("homebarholder");

            // Replace the inner HTML of the element with the fetched HTML
            elementToReplace.innerHTML = html;
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error fetching new HTML:', error);
        });
});
/**
 * Loads the top navigation bar HTML content for logged in users when the DOM is fully loaded.
 * 
 * This function listens for the 'DOMContentLoaded' event which is fired when the initial HTML document has been completely loaded and parsed.
 * It then fetches the 'top_nav_bar_after_log_in.html' file from the 'texts' directory.
 * If the fetch is successful, it replaces the inner HTML of the element with id 'innavholder' with the fetched HTML.
 * If there is an error during the fetch, it logs the error to the console.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Fetch the 'top_nav_bar_after_log_in.html' file from the 'texts' directory
    fetch('./texts/top_nav_bar_after_log_in.html')
        .then(response => {
            // Convert the response to text
            return response.text();
        })
        .then(html => {
            // Get the element with id 'innavholder'
            var elementToReplace = document.getElementById("innavholder");

            // Replace the inner HTML of the element with the fetched HTML
            elementToReplace.innerHTML = html;
        })
        .catch(error => {
            // Log any errors to the console
            console.error('Error fetching new HTML:', error);
        });
});
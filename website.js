// Define a function to fetch and display JSON data
function fetchAndDisplayData() {
    // Fetch JSON data from the provided URL using D3.js
    d3.json("http://34.147.162.172/Circles/Towns/50")
        .then(function(data) {
            // Convert the JSON data to a string for display
            const output = JSON.stringify(data, null, 2);

            // Select the paragraph element by its ID and update its content with the fetched data
            d3.select("#data-output").text(output);
        })
        .catch(function(error) {
            // If there's an error, display a message in the paragraph
            d3.select("#data-output").text("Error fetching data: " + error);
        });
}

// Call the function when the page loads
fetchAndDisplayData();

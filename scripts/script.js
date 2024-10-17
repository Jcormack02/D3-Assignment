function setupMap(numTowns = 50) { //default number of towns being 50 if no number is chosen by the user
    // Use ArcGIS's AMD module loader to load Esri modules
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",  // To plot the points on the map
        "esri/layers/GraphicsLayer"  // To hold all the points
    ], function(Map, MapView, Graphic, GraphicsLayer) {

        // Create the map with a 'streets-navigation-vector' basemap
        const map = new Map({
            basemap: "streets-navigation-vector"
        });

        // Create a MapView to display the map in the 'viewDiv' container
        const view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-4, 55.378051],  // Center on the UK
            zoom: 5
        });

        // Create a GraphicsLayer to hold the points
        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);

        // Create a scale for the size of the point in relation to population
        const sizeScale = d3.scaleLinear()
        .domain([10000, 500000]) // The population range
        .range([4, 70]) // The size difference (4px-20px)

        // Fetch data using D3 and add it to the map
        d3.json(`http://34.147.162.172/Circles/Towns/${numTowns}`)
          .then(function(data) {
            console.log("Data fetched:", data);

            // Add points to the map
            data.forEach(function(location) {
                const point = {
                    type: "point",
                    longitude: location.lng,
                    latitude: location.lat
                };

                const pointGraphic = new Graphic({
                    geometry: point,
                    symbol: {
                        type: "simple-marker",
                        color: "rgba(255, 0, 0, 0.6)", //This makes the red slightly opaque
                        size: sizeScale(location.Population), // Setting the size of the dot in relation to the population size
                        outline: {
                            color: "rgba(0, 0, 0, 0.3)",  // Optional: add a semi-transparent outline
                            width: 1
                        }
                    },
                    attributes: location,
                    popupTemplate: {
                        title: location.Town,
                        content: `Population: ${location.Population} <br> County: ${location.County}`
                    }
                });

                graphicsLayer.add(pointGraphic);
            });
          })
          .catch(function(error) {
            console.error("Error fetching data:", error);
          });
    });
}


function updateMap() {
    // Get the user input for the number of towns
    const numTowns = document.getElementById("quantity").value;

    // Clear the current map (you can implement a method to clear the previous data if needed)
    document.getElementById("viewDiv").innerHTML = "";  // This will reset the map view div

    // Call setupMap with the user input, or default to 50 if input is invalid
    setupMap(numTowns);
}

// Call setupMap() with 50 as default on page load
window.onload = function() {
    setupMap(50);  // Display 50 towns by default
};

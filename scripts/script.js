function setupMap(numTowns, basemap) { //default number of towns being 50 if no number is chosen by the user
    // Use ArcGIS's AMD module loader to load Esri modules
    require([
        "esri/Map",
        "esri/views/MapView",
        "esri/Graphic",  // To plot the points on the map
        "esri/layers/GraphicsLayer",  // To hold all the points
        "esri/layers/support/LabelClass" // To allow the name of the town to be displayed on the map
    ], function(Map, MapView, Graphic, GraphicsLayer, LabelClass) {

        // Create the map with a 'streets-navigation-vector' basemap
        const map = new Map({
            basemap: basemap
        });

        // Create a MapView to display the map in the 'viewDiv' container
        const view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-4, 55.378051],  // Center on the UK
            zoom: 5,
        });

        // Create a GraphicsLayer to hold the points
        const graphicsLayer = new GraphicsLayer();
    
        // Create a LabelClass to display the name of the town on the map
        const labelClass = new LabelClass({
            symbol: {
                type: "text",
                color: "white",
                haloColor: "blue",
                haloSize: "1",
                font: {
                    family: "Black Ops One",
                    style: "normal",
                    weight: "bold",
                    size: 14
                }
            },
            labelPlacement: "below-center", // Positions the town name below the dot point on the map
            labelExpressionInfo: {
                expression: "$feature.Town" // Applies the town name variable to the label
            }
        });

        graphicsLayer.labelingInfo = [labelClass]; // Add the label to the graphics layer where the points are held in

        
        map.add(graphicsLayer); // Adds the graphics layer on to the map

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

                graphicsLayer.add(pointGraphic); // Adds the marker on to the map
            });

            // On hover functionality: Display popup when the user hovers over a point
            view.on("pointer-move", function(event) {
                view.hitTest(event).then(function(response) {
                    if (response.results.length) {
                        // Filter results to get graphics from the GraphicsLayer
                        const graphic = response.results.filter(function(result) {
                            return result.graphic.layer === graphicsLayer;
                        })[0]?.graphic;

                        if (graphic) {
                            view.openPopup({
                                location: graphic.geometry,  // Set popup location at the point
                                features: [graphic]  // Automatically use the graphic's popupTemplate
                            });
                        } else {
                            view.closePopup();  // Close the popup if not hovering over a graphic
                        }
                    } else {
                        view.closePopup();  // Close the popup if not hovering over a graphic
                    }
                });
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

    // Clear any existing error message
    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
        errorMessage.remove();
    }

    // Displays an error message for the user if the input is not valid (not needed for user pressing enter on keyboard as this has a check already)
    if (isNaN(numTowns) || numTowns < 1 || numTowns > 500) {
        const errorDiv = document.createElement("div");
        errorDiv.id = "error-message"; // Obtains the id for the error message
        errorDiv.style.color = "red"; // Displays the text in red
        errorDiv.textContent = "Please enter a valid number between 1 and 500."; // Message displayed to the user
        document.body.appendChild(errorDiv); // Applies the error message on the html page
        return;  // Stop execution if the input is invalid
    }
    

    // Clear the current map (you can implement a method to clear the previous data if needed)
    document.getElementById("viewDiv").innerHTML = "";  // This will reset the map view div

    // Call setupMap with the user input, or default to 50 if input is invalid
    setupMap(numTowns, currentBasemap);
}

// Function to change the basemap based on user selection
function changeBasemap() {
    const basemapSelector = document.getElementById("basemapSelector");
    currentBasemap = basemapSelector.value;
    
    // Redraw the map with the new basemap and current number of towns
    const numTowns = document.getElementById("quantity").value || 50;  // Default to 50 towns if none selected
    setupMap(numTowns, currentBasemap);
    }
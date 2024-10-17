function setupMap() {
    // Use ArcGIS's AMD module loader to load Esri modules
    require([
        "esri/Map", // To obtain the map template
        "esri/views/MapView", // To get the specific version of the map
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

        // Fetch data using D3 and add it to the map
        d3.json("http://34.147.162.172/Circles/Towns/50")
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
                        color: "red",
                        size: "8px"
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


  // Set Icon Colours
  mahogany = "#420C09"
  scarlet = "#900D09"
  cherry = "#990F02"
  red = "#D0312D"
  rose = "#E3242B"
  blush = "#BC544B"
  


// Set up URL
queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Set up geoJSON request
d3.json(queryUrl).then(function (data) {
    console.log(data);
    
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

// Function to determine marker color by depth
function chooseColor(depth) {
  if (depth < 10) return mahogany;
  else if (depth < 30) return cherry;
  else if (depth < 50) return scarlet;
  else if (depth < 70) return blush;
  else if (depth < 90) return rose;
  else return red;

}
//change size of circles based on magnitude
function chooseRadius(magnitude) {
  return magnitude * 5;
}

  // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}</h2><hr><p>${new Date(feature.properties.time)}
        </p><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} meters<hr></p>`);
    }

    // Run the onEachFeature function once for each piece of data in the array.
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,

        // Point to layer used to alter markers
        pointToLayer: function (feature, coordinates) {
            // Determine the style of markers based on properties
            var markers = {
                radius: chooseRadius(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                fillOpacity: 0.4,
                color: "black",
                stroke: true,
                weight: 0.6
            }
            return L.circleMarker(coordinates, markers);
        }
    });

    // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [41, 35],
        zoom: 3,
        layers: [street, earthquakes]
    });

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
    

}



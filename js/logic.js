
// URL for GeoJSON endpoint 

var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'

// Extract the features data from GeoJSON response
d3.json(url).then(function(data) {
createFeatures(data.features);
});

function createFeatures(earthquakeData) {

// Function that runs once for each feature in the features array
// Gives each feature a popup describing the place, time, and magnitude of the earthquake
function onEachFeatureLayer(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
}
// Function that makes circle markers that vary in size, color, and opacity
// based on the magnitude of each earthquake
function onEachFeature(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
        color: '#000',
        weight: .5,
        fillOpacity: markerOpacity(feature.properties.mag),
        fillColor: chooseColor(feature.properties.mag),
        radius:  markerSize(feature.properties.mag),
      });
}

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeatureLayer,
    pointToLayer: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define lightMap, satelliteMap, and outdoorMap layers
    var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
    });

    var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
    });

    var outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
    });

    // baseMaps object to hold base layers
    var baseMaps = {
    "Grey & White Map": lightMap,
    "Satellite Map": satelliteMap,
    "Outdoors Map": outdoorMap
    };

    // Overlay object to hold overlay layer
    var overlayMaps = {
    Earthquakes: earthquakes
    };

    // Create the map, giving it the lightmap and earthquakes layers to display on load
    var myMap = L.map("map", {
    center: [37.6872, -97.3301],
    zoom: 4,
    layers: [lightMap, earthquakes]
    });

    // Create a layer control
    // Pass in baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);

    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function(myMap) {
      L.DomUtil.create('div', 'container');
      let div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];

      for (let i = 0; i < grades.length; i++) {
        div.innerHTML += '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };
    legend.addTo(myMap);
}
// Function to select the color of the marker based on magnitude
function chooseColor(magnitude) {
    return magnitude > 5 ? "red":
        magnitude > 4 ? "orange":
        magnitude > 3 ? "gold":
            magnitude > 2 ? "yellow":
            magnitude > 1 ? "yellowgreen":
                "greenyellow";
}
// Function to create the size of the marker based on magnitide
function markerSize(magnitude) {
    return magnitude * 5;
}
// Function to set the opacity of the marker based on magnitude
function markerOpacity(magnitude) {
    return magnitude * .15;
}

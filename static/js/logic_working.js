// Start of the USGS Earthquake data - Using Day 1 - Activity 10
console.log("nithiya");

// Store our API endpoint inside queryUrl
const queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);
});

// Creating a variable for each tile layer
const streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

const darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});


const satellite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

// Define a baseMaps object to hold our base layers
const baseMaps = {
  "Street Map": streetmap,
  "Dark Map": darkmap,
  "Satellite": satellite
};

// Create variables for earthquakes and tectonic plates
const earthquakes = new L.layerGroup();
const tectonicPlates = new L.layerGroup();


// Create overlay object to hold our overlay layer
const overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic Plates": tectonicPlates
};

// Create our map, giving it the streetmap and earthquakes layers to display on load
const myMap = L.map("map", {
  center: [
    15.5994, -28.6731
  ],
  zoom: 2,
  layers: [satellite, earthquakes, tectonicPlates]
});

// Create a layer control
// Pass in our baseMaps and overlayMaps
// Add the layer control to the map
L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(myMap);

// Get earthquake data
// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log(data);


  // Create function to get radius - getRadius - all earthquake in this dataset is magnitude 1 or larger
  function getRadius(magnitude) {
    return Math.sqrt(magnitude) * 6; //multiply by scaling factor like 6 to help visualize the earthquake
  }

  // Create function to get color - using switch and depth
  // Color from colorbrewer2.org 
  function getColor(depth) {
    switch (true) {
      case depth > 90:
        return "#d73027";
      case depth > 70:
        return "#fc8d59";
      case depth > 50:
        return "#fee08b";
      case depth > 30:
        return "#ffffbf";
      case depth > 10:
        return "#d9ef8b";
      default:
        return "#91cf60";
    }
  }

  // Create function to get style
  function getStyle(features) {
    return {
      fillColor: getColor(features.geometry.coordinates[2]),
      radius: getRadius(features.properties.mag),
      weight: 0.5,
      stroke: true,
      opacity: 0.9,
      fillOpacity: 0.7
    };
  }

  // Add geojson layer to the map
  // Creating a circle marker for wach of the earthquake using pointToLayer option to create a circle marker.
  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // get style for the circle marker
    style: getStyle,

    // for each feature include popup using onEachFeature option from Leaflet Choropleth tutorial
    onEachFeature: function (features, layer) {
      layer.bindPopup(
        "Location: "
        + features.properties.place
        + "<br> Time: "
        + Date(features.properties.time)
        + "<br> Magnitude: "
        + features.properties.mag
        + "<br> Depth: "
        + features.geometry.coordinates[2]
      );
    }

  }).addTo(earthquakes);

}); // Dont go below this line.

// Get Tectonic plates
// https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plateData) {

  // Create geojson layer and add to tectonic plates
  L.geoJSON(plateData, {
    color: "orange",
    weight: 2
  })
    .addTo(tectonicPlates);
});

// Create a legend 

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function () {

  var div = L.DomUtil.create('div', 'info legend');
    grades = [90, 70, 50, 30, 20, 10],
    colors = [
      // colors need to match the order of the grades
      "#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60"];


// loop through the density intervals and generate a label with a colored square for each interval
for (var i = 0; i < grades.length; i++) {
  div.innerHTML +=
    '<i style="background:'
    + colors[i] //use color vs grades
    + '"></i>'
    + grades[i]
    + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}
  return div;
};

legend.addTo(myMap);

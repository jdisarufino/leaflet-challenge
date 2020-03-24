// Create object for HTML id "map"
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution:
    'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 13,
  minZoom: 3,
  id: "mapbox.outdoors",
  accessToken: API_KEY
}).addTo(myMap);

var requestURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
// var geojsonData = d3.json(requestURL, function(response){
  // console.log(response.features);
// });


function markerSize(data) {
  return data * 6;
};

// function to call formatting settings on each item
function geojsonSettings(feature) {
  return {
  color: "white",
  opacity: 0.75,
  weight: 1,
  fillColor: "orange",
  fillOpacity: 0.5,
  // Setting circle's radius equal to the output of our markerSize function
  radius: markerSize(feature.properties.mag)
  };
}  

// function geojsonPopup(){
//   .bindPopup("<h2>〰️ Magnitude: " + magnitude + "</h2> <hr> <p>Earthquake detected " + where + " at " + time.toISOString().slice(11,19) + " GMT</p>")
// }

// run functions and build map layers
d3.json(requestURL, function(data) {
  console.log(data);
  for (var i = 0; i < data.features.length; i++) {
    // each variable elements
    var latlng = [data.features[i].geometry.coordinates[1],data.features[i].geometry.coordinates[0]]
    var magnitude = data.features[i].properties.mag
    var where = data.features[i].properties.place
    var time = new Date(data.features[i].properties.time)
  }
    // build circles for each element
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng);
      },
      style: geojsonSettings
    })//.bindPopup("Mag: " + feature.properties.mag)
    .addTo(myMap);

});
// onionLayers();
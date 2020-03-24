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


function markerSize(magnitude) {
  return (magnitude) * 40000;
}

function styleInfo(feature) {
  return {
    opacity: .75,
    fillOpacity: .5,
    fillColor: "orange",
    color: "white",
    radius: markerSize(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

var requestURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

d3.json(requestURL, function(response) {
var makingMap = {
  for (var i = 0; i < response.features.length; i++) {
    var latLong = [response.features[i].geometry.coordinates[1],response.features[i].geometry.coordinates[0]]
    var magnitude = response.features[i].properties.mag
    var where = response.features[i].properties.place
    var time = new Date(response.features[i].properties.time);
    L.geoJSON(latLong, {
      pointToLayer: function(feature, latLong){
        return L.circleMarker(latLong);
      }
      style: styleInfo
    })
  }
}
}).bindPopup("<h2>〰️ Magnitude: " + magnitude + "</h2> <hr> <p>Earthquake detected " + where + " at " + time.toISOString().slice(11,19) + " GMT</p>");.addTo(myMap);

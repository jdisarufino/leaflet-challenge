// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
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

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
// load data to some variables 
var requestURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
var geoJson;
var geoCircles;

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
// fucntion making all marker sizes more visible
function markerSize(data) {
  return data * 7;
};

// function passing magnitude against color qualifier
function getColor(data) {
  return data > 7 ? "#b10026" :
    data > 6 ? "#e31a1c" :
    data > 5 ? "#fc4e2a" :
    data > 4 ? "#fd8d3c" :
    data > 3 ? "#feb24c" :
    data > 2 ? "#fed976" :
    data > 1 ? "#ffeda0" :
              "#ffffcc" ;
};

// function to call formatting settings on each item
function geoJsonSettings(features) {
  return {
  color: "white",
  // Setting circle's color equal to the range of getColor function
  fillColor: getColor(features.properties.mag),
  // // // // // // // // // // // // // // // 
  opacity: 0.75,
  weight: 2,
  fillOpacity: 0.9,
  // Setting circle's radius equal to the output of our markerSize function
  radius: markerSize(features.properties.mag)
  // // // // // // // // // // // // // // //
  }
};

// # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # 
// Map Marker Maker
d3.json(requestURL, function(data) {
  console.log(data); // preview data

  // Circle layers (location and color/size by magnitude)
  geoCircles = L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: geoJsonSettings, // see function above

    // Binding a pop-up to each layer
    onEachFeature: function(feature, layer) {
      layer.bindPopup(
        "<h3>Magnitude: " + 
        feature.properties.mag +
        "</h3><hr>" +
        "Located " + 
        feature.properties.place
      );
    }
  });

  // Set up the legend
  var iAmLegend = L.control({ position: "bottomleft" });
  iAmLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var colors = [1,2,3,4,5,6,7,8];
    var labels = ["<1","<2","<3","<4","<5","<6","<7","<8"];
    div.innerHTML = "<h3>Earthquake<br>Legend</h3><hr>";
    // for loop to append HTML colors (var "colors" lookup) and labels (var "labels")
    colors.forEach(function(limit, index) {
      div.innerHTML += 
        '<p style="background-color:' + 
        getColor(colors[index]) + '">' + 
        '<i>' + 
        'Magnitude ' +
        labels[index] + 
        '</i>' + 
        '</p>';
    }); 
    // pass in div HTML elements
    return div;
  }
  // slap to the map!
  geoCircles.addTo(myMap);
  iAmLegend.addTo(myMap);
});

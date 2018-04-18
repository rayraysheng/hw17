// Creating our initial map object
// We set the longitude, latitude, and the starting zoom level
// This gets inserted into the div with an id of 'map'
var myMap = L.map('map', {
  center: [37.09, -95.71],
  zoom: 5,
});

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
var baseLayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
    "access_token=pk.eyJ1IjoicmF5c2hlbmciLCJhIjoiY2pldm9ybDBrMHpjNjJxczh2dWE5NzhnNSJ9.LK-z4Vs0pl0VnZ-01C6YGQ");

baseLayer.addTo(myMap);

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl, function(response){

	console.log(response.features[0]);

	var quakeLayer = new L.layerGroup();

	for (var i = 0; i < response.features.length; i++) {

		var currentFeature = response.features[i];
		var lat = currentFeature.geometry.coordinates[1];
		var lng = currentFeature.geometry.coordinates[0];
		var mag = currentFeature.properties.mag;

		var redness = mag * 25;
		var fillColor;
		if (mag > 5) {
			fillColor = "#ff0000"
		} else if (mag > 4) {
			fillColor = "#ff3300"
		} else if (mag > 3) {
			fillColor = "#ff9900"
		} else if (mag > 2) {
			fillColor = "#ffff00"
		} else if (mag > 1) {
			fillColor = "#99ff00"
		} else if (mag < 1) {
			fillColor = "00ff00"
		};

		quakeLayer.addLayer(L.circle([lat, lng], {
		  stroke: false,
		  fillColor: fillColor,
		  fillOpacity: 0.7,
		  radius: mag * 10000,
		}).bindPopup(
		  "<h3>" + currentFeature.properties.place + "</h3>" + 
		  "<hr>"+
		  "<p>" + new Date(currentFeature.properties.time) + "</p>" +
      	  "<p>" + "Magnitude: " + mag + "</p>"
		))
	};

	quakeLayer.addTo(myMap);

});

var faultLineUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(faultLineUrl, function(response){
	console.log(response)

	var faultLayer = new L.GeoJSON();
	for (var i = 0; i < response.length; i++){
		var faultFeature = response.features[i];

		faultLayer.addData(faultFeature);
	}

	faultLayer.addTo(myMap)

})
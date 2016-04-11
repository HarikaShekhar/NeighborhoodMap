// data with location to be displayed on the map initially

var places = {
	"initialMap" : {
		"center": {
			"lat": 37.399072,
			"lng": -121.920731
		},
		"zoom": 11,
		// "mapTypeControl": false
	},
	"mapPlaces": [
		{
			"address": "690 River Oaks Pkwy, Ste A, San Jose, CA 95134",
			"name": "Chase Bank",
			"coordinates": {
				"lat": 37.397928,
				"lng": -121.924195
			},
		},
		{
			"address": "Rivermark Village, 3970 Rivermark Plaza, Santa Clara, CA 95054",
			"name": "Safeway Supermarket",
			"coordinates": {
				"lat": 37.394924,
				"lng": -121.947680
			}
		},
		{
			"address": "790 Montague Expy, San Jose, CA 95131",
			"name": "Chevron Gas Station",
			"coordinates": {
				"lat": 37.397866,
				"lng": -121.912859
			}
		},
		{
			"address": "447 Great Mall Dr, Milpitas, CA 95035",
			"name": "Great Mall",
			"coordinates": {
				"lat": 37.415980,
				"lng": -121.897477
			}
		},
		{
			"address": "2000 Bart Way, Fremont, CA 94536",
			"name": "Bart Station",
			"coordinates": {
				"lat": 37.557640,
				"lng": -121.976600
			}
		},
		{
			"address": "3331 N 1st St, San Jose, CA 95134",
			"name": "Santa Clara VTA",
			"coordinates": {
				"lat": 37.400609,
				"lng": -121.940208
			}
		}
	]
};

var initializeMap = function() {
	var map = new google.maps.Map(document.getElementById('map'), places.initialMap);

	ko.applyBindings(new MapViewModel(map));
};

var MapViewModel = function(map) {
	var self = this;
	self.map = map;
	self.inputString = ko.observable('');
	self.locations = ko.observableArray([]);

	places.mapPlaces.forEach(function(place) {
		self.locations().push(place);
	});

	self.bounds = new google.maps.LatLngBounds();
	console.log(self.bounds);

	self.addMapMarkers = function() {
		self.locations().forEach(function(place) {
			place.map = self.map;

			place.marker = new google.maps.Marker({
				map: place.map,
				position: place.coordinates,
				animation: google.maps.Animation.DROP,
		        title: place.name
			});
		    // this is where the pin actually gets added to the map.
		    // bounds.extend() takes in a map location object
		    self.bounds.extend(new google.maps.LatLng(place.coordinates));
		    // place.marker.setMap(place.map);

	     	place.marker.addListener('click', function() {
		        self.selectPlace(place);
		    });


		});

        // fit the map to the new marker
	    self.map.fitBounds(self.bounds);
	    // center the map
	    self.map.setCenter(self.bounds.getCenter());
	};

	self.addMapMarkers();



	    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object




	self.filterPlaces = function() {

	};

};
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
	self.markers = [];

	places.mapPlaces.forEach(function(place) {
		place.clicked = ko.observable(false);
		self.locations().push(place);
	});

	self.bounds = new google.maps.LatLngBounds();


	self.addMapMarkers = function() {
		self.locations().forEach(function(place) {
			place.map = self.map;

			place.marker = new google.maps.Marker({
				map: place.map,
				position: place.coordinates,
				animation: google.maps.Animation.DROP,
		        title: place.name
			});

			self.markers.push(place.marker);

		    // this is where the pin actually gets added to the map.
		    // bounds.extend() takes in a map location object
		    self.bounds.extend(new google.maps.LatLng(place.coordinates));
		    // place.marker.setMap(place.map);

	     	place.marker.addListener('click', function() {
		        self.displayPlaceInfo(place);
		    });


		});

        // fit the map to the new marker
	    self.map.fitBounds(self.bounds);
	    // center the map
	    self.map.setCenter(self.bounds.getCenter());
	};

	self.addMapMarkers();

	self.filterPlaces = function(value) {
		self.locations.removeAll();
		self.markers.forEach(function(marker){
			marker.setMap(null);
		});

		self.markers = [];

		var filterString = self.inputString().toLowerCase();
		places.mapPlaces.forEach(function(place){
			if (place.name.toLowerCase().indexOf(filterString) >= 0) {
				self.locations.push(place);
			}
		});

		self.addMapMarkers();
	};

	self.inputString.subscribe(self.filterPlaces);

	self.resetFilter = function() {
		self.inputString('');
		places.mapPlaces.forEach(function(place) {
			self.locations().push(place);
		});

		self.bounds = new google.maps.LatLngBounds();;
		self.locations().forEach(function(place){
			self.bounds.extend(new google.maps.LatLng(place.coordinates));
			place.clicked(false);
			place.marker.setAnimation(null);
		});

        // fit the map to the new marker
	    self.map.fitBounds(self.bounds);
	    // center the map
	    self.map.setCenter(self.bounds.getCenter());
	};

	self.toggleBounce = function(marker) {
	    if (marker.getAnimation() !== null) {
	    	marker.setAnimation(null);
	    } else {
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	  	}
	};

	self.displayPlaceInfo = function(selectedPlace) {
		self.markers.forEach(function(marker){
			if (marker != selectedPlace.marker) {
				marker.setAnimation(null);
			}
		});

		self.toggleBounce(selectedPlace.marker);

		self.locations().forEach(function(place){
			if (place != selectedPlace && place.clicked(true)) {
				place.clicked(false);
			}
		});

		if (selectedPlace.clicked() == true) {
			selectedPlace.clicked(false)
		} else {
			selectedPlace.clicked(true);
		}

		selectedPlace.map.panTo(selectedPlace.coordinates);
	};

};
// data with location to be displayed on the map initially

var places = {
	"initialMap" : {
		"center": {
			"lat": 37.399072,
			"lng": -121.920731
		},
		"zoom": 11,
		"mapTypeControl": false
	},
	"mapPlaces": [
		{
			"address": "690 River Oaks Pkwy, Ste A, San Jose, CA 95134",
			"name": "Chase Bank",
			"coordinates": {
				"lat": 37.397928,
				"lng": -121.924195
			},
			"icon": "http://maps.google.com/mapfiles/kml/pal2/icon53.png",
			"category": "banks"
		},
		{
			"address": "Rivermark Village, 3970 Rivermark Plaza, Santa Clara, CA 95054",
			"name": "Safeway Supermarket",
			"coordinates": {
				"lat": 37.394924,
				"lng": -121.947680
			},
			"icon": "http://maps.google.com/mapfiles/kml/pal3/icon18.png",
			"category": "convenience"
		},
		{
			"address": "367 Cypress Dr, Milpitas, CA 95035",
			"name": "Chevron Gas Station",
			"coordinates": {
				"lat": 37.421851,
				"lng": -121.921750
			},
			"icon": "http://maps.google.com/mapfiles/kml/pal2/icon21.png",
			"category": "servicestations"
		},
		{
			"address": "447 Great Mall Dr, Milpitas, CA 95035",
			"name": "Great Mall",
			"coordinates": {
				"lat": 37.415980,
				"lng": -121.897477
			},
			"icon": "http://maps.google.com/mapfiles/kml/pal3/icon21.png",
			"category": "shoppingcenters"
		},
		{
			"address": "2000 Bart Way, Fremont, CA 94536",
			"name": "Bart Station",
			"coordinates": {
				"lat": 37.557640,
				"lng": -121.976600
			},
			"icon": "http://maps.google.com/mapfiles/ms/micons/rail.png",
			"category": "publictransport"
		},
		{
			"address": "3331 N 1st St, San Jose, CA 95134",
			"name": "Santa Clara VTA",
			"coordinates": {
				"lat": 37.400609,
				"lng": -121.940208
			},
			"icon": "http://maps.google.com/mapfiles/ms/micons/tram.png",
			"category": "publictransport"
		}
	],
	"yelpSuccessMessage": function(name, addressLine1, addressLine2, rating_img_url, image_url, business_url){
		return '<div id="content">' +
				   '<h2 id="heading">' + name + '</h2>' +
				   '<div id="description">Click the button for Yelp Reviews about <em><b>' + name + '</b></em>' + '<br>' +
					   '<div id="yelp">'+
						   '<p>' +
							   '<b>Address:</b> ' + addressLine1 + ', ' + addressLine2 +
						   '</p>' +
						   '<p>Ratings: <img src="' + rating_img_url + '" alt="ratings image"/></p>' +
						   '<img src="' + image_url + '" alt="image of place"/>' + '<br><br>' +
						   '<a href="' + business_url + '" target="_blank"><img src="images/yelp_review_btn_red.png"/></a>' +
					   '</div>' + //#yelp ends here
				   '</div>' + //#description ends here
			   '</div>' //#content ends here
	},
	"yelpErrorMessage": function(name){
		return '<div id="content>' +
				   '<h2 id="heading">' + name + '</h2>' +
				   '<div id="description"><h2>Woops!</h2>' +
					   '<p>Could not fetch information from Yelp for <em><b>' + name + '</b></em></p>' +
					   '<p>Please check your internet connect and try again later.</p>' +
				   '</div>' + //#description
			   '</div>' //#content
	}

};

var initializeMap = function() {
	var map = new google.maps.Map(document.getElementById('map'), places.initialMap);
	infoWindow = new google.maps.InfoWindow({
			content: "",
			maxWidth: 250
	});
	ko.applyBindings(new MapViewModel(map, infoWindow));
};

var googleErrorHandler = function(e){
	$('#map').text('Woops! Could not load Google maps. Please check your internet connection and try again.');
};

var MapViewModel = function(map, infowindow) {
	var self = this;
	self.map = map;
	self.infowindow = infowindow;
	self.inputString = ko.observable('');
	self.locations = ko.observableArray([]);
	self.markers = [];

	self.compare = function(a,b) {
	  if (a.name < b.name)
	    return -1;
	  else if (a.name > b.name)
	    return 1;
	  else
	    return 0;
	};

	places.mapPlaces.sort(self.compare);

	// places.mapPlaces.sort();
	places.mapPlaces.forEach(function(place) {
		place.clicked = ko.observable(false);
		self.locations().push(place);
	});

	self.bounds = new google.maps.LatLngBounds();


	self.addMapMarkers = function() {
		self.locations().forEach(function(place) {
			place.map = self.map;
			place.infowindow = self.infowindow;
			place.marker = new google.maps.Marker({
				map: place.map,
				position: place.coordinates,
				animation: google.maps.Animation.DROP,
		        title: place.name,
		        icon: place.icon
			});

			self.markers.push(place.marker);

		    // this is where the pin actually gets added to the map.
		    // bounds.extend() takes in a map location object
		    self.bounds.extend(new google.maps.LatLng(place.coordinates));
		    // place.marker.setMap(place.map);

		    // self.getYelpReviews(place);

	     	place.marker.addListener('click', function() {
		        self.displayPlaceInfo(place);
		        // place.infowindow.open(place.map, place.marker);
		    });
		});

        // fit the map to the new marker
	    self.map.fitBounds(self.bounds);
	    // center the map
	    self.map.setCenter(self.bounds.getCenter());
	};

	self.getYelpReviews = function(place) {
		//Fromt his useful link: https://github.com/levbrie/mighty_marks/blob/master/yelp-search-sample.html
    	var auth = {
    		consumerKey : "XYBDe1H6mOgNCWXGfiJZaQ",
			consumerSecret : "AGCTqcGXajIqjABfSn4LXk4yfcY",
			accessToken : "2mLbAaofW3euUQE4xYSIxfveWAbKVPuU",
			// This example is a proof of concept, for how to use the Yelp v2 API with javascript.
			// You wouldn't actually want to expose your access token secret like this in a real application.
			accessTokenSecret : "BLuRQ1aZZPjgroD3tPrnMSS-RhQ",
			serviceProvider : {
				signatureMethod : "HMAC-SHA1"
	    	}
	    };

	    var accessor = {
	        consumerSecret : auth.consumerSecret,
	        tokenSecret : auth.accessTokenSecret
	    };

        var parameters = [];
		parameters.push(['term', place.name]);
		parameters.push(['location', place.address]);
		parameters.push(['sort', 1]);
		parameters.push(['category_filter', place.category]);
		parameters.push(['callback', 'cb']);
		parameters.push(['oauth_consumer_key', auth.consumerKey]);
		parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
		parameters.push(['oauth_token', auth.accessToken]);
		parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

	    var message = {
	        'action' : 'http://api.yelp.com/v2/search',
	      	'method' : 'GET',
	      	'parameters' : parameters
	    };

	    OAuth.setTimestampAndNonce(message);
	    OAuth.SignatureMethod.sign(message, accessor);

	    var parameterMap = OAuth.getParameterMap(message.parameters);
	    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

	    $.ajax({
			'url' : message.action,
			'data' : parameterMap,
			'cache' : true,
			'dataType' : 'jsonp',
			//using timeout to force error handling - may need to tweak this for mobile use.
			'timeout' : 2000,
			error: function() {
				place.infowindow.setContent(places.yelpErrorMessage(place.name));
				// place.infowindow.open(place.map, place.marker);
			}
	    }).done(function(data){
			// console.log(data);
			var addressLine1 = data.businesses[0].location.display_address[0],
				addressLine2 = data.businesses[0].location.display_address[1],
				rating_img_url = data.businesses[0].rating_img_url,
				image_url = data.businesses[0].image_url,
				business_url = data.businesses[0].url;

	    	place.infowindow.setContent(places.yelpSuccessMessage(place.name, addressLine1, addressLine2, rating_img_url, image_url, business_url));
	    	// place.infowindow.open(place.map, place.marker);
	    });
	}; //getYelpReviews()

	self.addMapMarkers();

	self.filterPlaces = function(value) {
		self.locations.removeAll();
		self.markers.forEach(function(marker){
			marker.setMap(null);
		});

		self.markers = [];

		var filterString = self.inputString().toLowerCase();
		places.mapPlaces.forEach(function(place){
			if (place.name.toLowerCase().indexOf(filterString) >= 0 || place.category.toLowerCase().indexOf(filterString) >= 0) {
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
			place.infowindow.close();
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
		self.getYelpReviews(selectedPlace);
		self.markers.forEach(function(marker){
			if (marker != selectedPlace.marker) {
				marker.setAnimation(null);
			}
		});

		self.toggleBounce(selectedPlace.marker);

		self.locations().forEach(function(place){
			if (place != selectedPlace && place.clicked(true)) {
				place.clicked(false);
				place.infowindow.close();
			}
		});

		if (selectedPlace.clicked() == true) {
			selectedPlace.clicked(false);
			selectedPlace.infowindow.close();
		} else {
			selectedPlace.clicked(true);
			selectedPlace.infowindow.open(selectedPlace.map, selectedPlace.marker);
		}

	    selectedPlace.infowindow.addListener('closeclick', function() {
	      selectedPlace.clicked(false);
	      selectedPlace.marker.setAnimation(null);
	    });

		selectedPlace.map.panTo({lat: selectedPlace.coordinates.lat + 0.05, lng: selectedPlace.coordinates.lng });
	};
};


// TODO
// 1. Sort the list alphabetically -- done
// 2. Small devices: Check the navbar
// 5. autocomplete search
// 6. Check flights API
// 7. Add category for filter search
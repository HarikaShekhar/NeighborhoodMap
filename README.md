Project Name: Neighborhood Maps
-------------------------------

About Project:
--------------

This is a project about few places in my neighborhood. It shows a google map with markers for these places, a list view of these places and a search bar for filtering places.
The Infowindow of each place displays its customer ratings and a link to its Yelp page.

View the project here:

http://harikashekhar.github.io/NeighborhoodMap

filter categories: banks, coffee, restaurants, shoppingcenters, convenience, servicestations, public transports and airports

Responsive: works well on small screens too.

Getting started - How to use the app:
------------------------------------

1. Check out the repository or download the repository to local machine.
2. Open Terminal, navigate to Project folder and run 'gulp' command.
   This will fetch all the dependencies listed in package.json file and create a 'dist' folder with the all project files.
3. To run a local server, Navigate to 'dist'and run the following command.

	$> cd /path/to/your-project-folder
  	$> python -m SimpleHTTPServer 8080

4. Download and install [ngrok](https://ngrok.com/) to make the local server accessible remotely.

   	Navigate to 'dist' folder and run the ngrok command as below.

   	``` bash
  	$> cd /path/to/your-project-folder
  	$> ngrok http 8080

  	Copy the public URL ngrok gives you and paste it in a browser to view the project page!

5. Alternatively, view the Project Page here:

	http://harikashekhar.github.io/NeighborhoodMap
6. Using the app:
   --------------

	Toggle button:
	--------------

		Click the toggle button to toggle the list view and search/filter bar.

	Filtering:
	----------

		Search for a place in the list by name or category.
		Places matching the search text will be filtered on map and in the list.

	Reset:
	------

		Click reset button to reset the map to show all places in the list and on map.

	List:
	-----

		Click a Place in the list to show it on map - opens Infowindow to show details about he place.
		Additionally, click the 'reviews by yelp'	button for Yelp page about the selected place.
		Clicking a place from the list:

			highlights it in the list view by changing the background color and by bouncing the marker on map.

	Map Marker:
	-----------

		Click a marker on map to show it on map - opens Infowindow to show details about he place.
		Additionally, click the 'reviews by yelp'	button for Yelp page about the selected place.
		Clicking a marker on the map:

			highlights it in the list view by changing the background color and by bouncing the marker on map.

Files:
------

package.json:

	Contains project metadeta - author, git repository and dependencies for Gulp.

gulpfile.js:

	Contains code for html and javascript minification, image compression and creates the optimized files in 'dist' folder.

index.html:

	The project file when clicked will open in the default browser and display a map with places and a list of places.
	Type a place name or category to filter in the search box. Click a list item or marker to open a infowindow and click the reviews on yelp button for detailed information and reviews.

app.js:

	'places'
	--------

		- has initial map data, places to be populated on the map, a function that is called when yelp API for a place is called succesfuly and a function for yelp API error handling.

		'initialMap'

			- contains data for initializing the map - lat, lng, zoom and mapTypeControl

		'mapPlaces'

			- contains place objects with address, name, lat,lng (coordinates), icon (marker icon) and category (coffee/restaurant etc) information.

		'yelpSuccessMessage'

			- This function is called when the Yelp API fetches data without errors and creates the data to be displayed in the infowindow.

		'yelpErrorMessage'

			- This function is called when the ajax call to yelp api return errors.

	'initializeMap'
	---------------

		- sets data for the initial map, handles navigation button toggle and displays the places on map and list.

	'addMapMarkers'
	---------------

		- Loops through each place in 'locations', which is an observable array of places from 'mapPlaces' and set the map marker for each place, map bounds and event handler for clicking a
	      map marker

    'displayPlaceInfo'
    -----------------

    	- When a marker or a list item is clicked, calls getYelpReviews(), toggles marker animation, toggles background color for selected list item, toggles display of infowindow.

  	'getYelpReviews'
  	---------------

  		- sets up data for OAUTH, calls the yelp API and populates infowindow based on success or failure of ajax call.

  	'filterPlaces'
  	--------------

  		- filters the list view and map markers on map based on the search string in the input box. The search string can be a name or category.

  	'resetFilter'
  	-------------

  		- Clear the input search box, repopulates complete list view and markers on the map.



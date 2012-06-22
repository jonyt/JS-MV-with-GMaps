var map = new google.maps.Map($('#map').get(0), { // Create the map
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	center: new google.maps.LatLng(-33.8665433,151.1956316),
	zoom: 15
});
map.markers = [];
var viewModel = {
	map : map,
	businesses: ko.observableArray([]),
	keyword: 'restaurants', // Set the value of the search text
	go : function () { // Define what happens when the 'go' data binding is invoked (look at the HTML in #get-places)							
		var request = { // Google Places request
			location: this.map.getCenter(),
			radius: '500',
			keyword: this.keyword
		};
		var theVM = this;
		var service = new google.maps.places.PlacesService(this.map);
		service.search(request, function callback(results, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
			    results = results.slice(0, 10); // We want only the first 10 results
			    $(this.map.markers).each(function (index, marker) { marker.setMap(null); }); // Delete all map markers
				theVM.map.markers = [];					
				theVM.businesses.removeAll(); // Delete all results from previous query
				$(results).each(function (i, item) {
					theVM.businesses.push(item); // Add results to the view model
					var icon = new google.maps.MarkerImage(item.icon, null, null, null, new google.maps.Size(20, 20));
					var marker = new google.maps.Marker({ 
						map 	 : map, 
						position : new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng()), 
						title 	 : item.name,
						icon 	 : icon		
					});
					map.markers.push(marker);
				});		
			}
		});
	}
};

ko.applyBindings(viewModel); // Make the magic happen
	

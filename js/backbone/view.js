AppView = Backbone.View.extend({
	  el: $("body"),
	  map : null,
	  template : null,
	  initialize: function () {	    
		this.places = new Places( null, { view: this }); // Initialize the collection, we have no initial value so we pass in null, but we do want to set the view
		map = new google.maps.Map(document.getElementById('map'), { // Create the map
		  mapTypeId: google.maps.MapTypeId.ROADMAP,
		  center: new google.maps.LatLng(-33.8665433,151.1956316),
		  zoom: 15
		});	
		map.markers = [];
		template = _.template("<li><b>Name</b>: <%= attributes.name %>, <b>Rating</b>: <%= attributes.rating %>, <b>Near</b>: <%= attributes.vicinity %>  <img class='place-image' src='<%= attributes.icon %>'></li>");
	  },
	  events: {
		"submit #search-form":  "getPlaces", // When the search form is submitted, invoke the getPlaces function
	  },
	  getPlaces: function () {
		$('#places').empty(); // Delete the places list
		$(map.markers).each(function (index, marker) { marker.setMap(null); }); // Delete all map markers		
		map.markers = [];
		
		var request = {
			location: map.getCenter(),
			radius: '500',
			keyword: $('#place').val()
		};
		var theView = this;
		var service = new google.maps.places.PlacesService(map);
		service.search(request, function callback(results, status) {
		  if (status == google.maps.places.PlacesServiceStatus.OK) {												
		    results = results.slice(0, 10); // We want only the first 10 results		  
			$.each(results, function(index, place){
				var placeModel = new Place({ // Create a model for this result
					name 	  : place.name,
					rating 	  : place.rating,
					vicinity  : place.vicinity,
					icon 	  : place.icon,
					latitude  : place.geometry.location.lat(),
					longitude : place.geometry.location.lng()
				});							
				theView.places.add(placeModel); // Now add it to the collection
			});						
		  }
		});		
	  },
	  addPlaceLi: function (model) {	
		//The parameter passed is a reference to the model that was added
		$("#places").append(template(model));
		var icon = new google.maps.MarkerImage(model.get('icon'), null, null, null, new google.maps.Size(20, 20));
		var marker = new google.maps.Marker({ 
			map 	 : map, 
			position : new google.maps.LatLng(model.get('latitude'), model.get('longitude')), 
			title 	 : model.get('name'),
			icon 	 : icon		
		});
		map.markers.push(marker);
	  }
});

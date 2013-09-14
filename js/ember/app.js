Places = Ember.Application.create();

Places.MapData = Ember.Object.create({
    map: null
});

Places.MapView = Ember.View.extend({
    tagName : 'div',    
    map : null,               
    didInsertElement : function() { // Create the map
        this._super();
        Places.MapData.set('map', new google.maps.Map($('#map').get(0), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(-33.8665433,151.1956316),
            zoom: 15
        }));
    }
});            

Places.placeListController = Ember.ArrayController.create();            

Places.searchController = Ember.Object.create({
    searchText: 'restaurants', // Set the value of the search text
    mapBinding: 'Places.MapData.map', // Create a map binding so we can easily access the map object
    search: function(){
        var request = {
            location: this.get('map').getCenter(),
            radius: '500',
            keyword: this.get('searchText')
        };
        var _this = this;
        var service = new google.maps.places.PlacesService(this.get('map'));
        service.search(request, function callback(results, status) {                        
            if (status == google.maps.places.PlacesServiceStatus.OK) {                                                                            
                results = results.slice(0, 10); // We want only the first 10 results
                Places.placeListController.set('content', results);    // Set the data for the controller    
                if (typeof _this.map.markers !== 'undefined') { // Clear the map markers
                    $(_this.map.markers).each(function (index, marker){
                        marker.setMap(null);
                    });
                }
                _this.map.markers = [];
                $(results).each(function(index, item){ // Create map markers
                    var icon = new google.maps.MarkerImage(item.icon, null, null, null, new google.maps.Size(20, 20));
                    var marker = new google.maps.Marker({ 
                        map      : _this.map, 
                        position : new google.maps.LatLng(item.geometry.location.lat(), item.geometry.location.lng()), 
                        title      : item.name,
                        icon      : icon        
                    });
                    _this.map.markers.push(marker);    
                });
            }
        });
    }            
});

Places.SearchView = Ember.TextField.extend(Ember.TargetActionSupport, { // Trigger the search form when enter is pressed
    valueBinding: 'Places.searchController.searchText',
    insertNewline: function() {
        this.triggerAction();
    }
});    

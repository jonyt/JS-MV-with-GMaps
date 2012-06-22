Places = Backbone.Collection.extend({
	initialize: function (models, options) {
		this.bind("add", options.view.addPlaceLi);
		//Listen for new additions to the collection and call a view function if so
	}
});

module.exports.index = {
	index: function(callback){


		var mongoose = require('mongoose');
		var db = mongoose.createConnection( 'mongodb://localhost:27017/apiv1' );

		var apiSchema = mongoose.Schema({
		    url: { type : String, trim : true, index : true, required: true, unique: true },
		    title: { type : String, trim : true },
		    type: String,
		    api: String
		});

		var Api = db.model('apis', apiSchema);

		var this_controller = this;


		Api.find({'type':'index'},function(err, data){
			console.error(err);
			this_controller.set('title', 'Kubrick Backstage');
			this_controller.set('site_title', 'Kb');
			this_controller.set('apis', data);
			callback(this_controller);
		});


	}
}

module.exports.index = {
	index: function(callback){


		var mongoose = require('mongoose');
		var db = mongoose.createConnection( 'mongodb://localhost:27017/apiv1' );


		var apiTypeSchema = mongoose.Schema({
			typeName: { type : String, trim : true, index : true, unique: true, required: true}
		});

		var apiSchema = mongoose.Schema({
		    url: { type : String, trim : true, index : true, required: true, unique: true },
		    title: { type : String, trim : true },
		    type: {type: mongoose.Schema.Types.ObjectId, ref: 'apiTypeSchema'},
		    api: {type: mongoose.Schema.Types.ObjectId, ref: 'apiSchema'}
		});

		var Api = db.model('apis', apiSchema);
		var ApiType = db.model('types', apiTypeSchema)

		var this_controller = this;


		Api.find(function(err, data){
			this_controller.set('title', 'Kubrick Backstage');
			this_controller.set('site_title', 'Kb');
			this_controller.set('apis', data);
			callback(this_controller);
		});


	}
}



var mongoose = require('mongoose');
var db = mongoose.createConnection( 'mongodb://localhost:27017/apiv1' );


var apiSchema = mongoose.Schema({
    url: { type : String, trim : true, index : true, required: true, unique: true },
    title: { type : String, trim : true },
    type: {type: mongoose.Schema.Types.ObjectId, ref: 'apiTypeSchema'},
    api: String
});


var Api = db.model('apis', apiSchema);

module.exports = Api;
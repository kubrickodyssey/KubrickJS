var Api = require('../models/api');

module.exports.api = {
	docs: function(callback, api_url){

		var $this = this;

		api_url = api_url || 'index';
		this.set('api_url', api_url);

		Api.find({url: api_url}, function(data){
			$this.set('apis', data);
			
			if(data == null){
				$this.response.view = 'not_exists';
			}

			callback($this, null);
		});
	},
	add: function(callback, api_url){


		callback(this);
	}

}
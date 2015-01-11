var _url = require('url');

function Helper(request){
	this.html = {
		url: function(url_options){
			var controller = url_options.controller || '';
			var view = url_options.action || '';
			var args = url_options.args || [];

			var this_url = _url.resolve('/', request.headers.host + '/');
			this_url = _url.resolve(this_url, controller + '/');
			this_url = _url.resolve(this_url, view + '/');

			for(var i in args)
			{
				this_url = _url.resolve(this_url, args[i] + '/');
			}

			return 'http://'+this_url;
		}
	}
}

module.exports = Helper;
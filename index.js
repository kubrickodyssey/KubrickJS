var http = require('http'),
	morgan = require('morgan'),
	mvc = require('./kubrickMVC');

var logger = morgan('combined');

var server = http.createServer(function(request, response){
	
	logger(request, response, function(err){

		if(err) throw err;

		global.request = request;
		global.response = response;

		var url = request.url;
		var url_array = url.toString().split('/');
		url_array.shift();

		var controller = url_array.shift() || 'index';
		var view = url_array.shift() || 'index';
		var args = url_array;

		var objController = mvc.getAction(controller, view);

		if(!objController) {
			response.writeHead(404, 'Not Found');
			response.end('Not Found');
			return;
		}
		
		objController.apply(this, args);
		response.end();

	});

});

server.listen(3000);
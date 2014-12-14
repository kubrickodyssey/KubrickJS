var http = require('http'),
	colors = require('colors'),
	config = require('./config'),
	defaultFile = config.defaultFile || 'index.html',
	fs = require('fs'),
	kubrickResponse = require('./response'),
	path = require('path'),
	port = config.port || 3000,
	url = require('url');




var kubrick = {};

kubrick.loadModule = function(req, res, callback){
	uri = path.join(req.url, "/");

	var routes = {
		'/admin/': function(request, response){
			res.end("Hola este es el index");
		}
	}


	var route = routes[uri];

	if(!route){
		callback(true);
	}else{
		route(req, res);
		callback(false);
	}

}

kubrick.run = function(){
		var server = http.createServer(function(request, response){
		response = kubrickResponse(response);


		var uri = url.parse(request.url).pathname;
		var file_path = path.join(process.cwd(), 'public');
		var filename = path.join(file_path, uri);


		if(path.join(filename, '/') == path.join(file_path, '/')){
			filename = path.join(filename, defaultFile);
		}


		console.log("Request File: %s", filename.green);

		fs.exists(filename, function(exists){
			if(!exists){

				kubrick.loadModule(request, response, function(err){
					if(err){
						response.writeHead(404, {"Content-Type": "text/plain"});
						response.write("404 Not Found!\n");
						response.end();
						return;
					}
				});


				return;
			}

			fs.readFile(filename, "binary", function(err, file){
				if(err){
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n" );
					response.end();
					return; 
				}

				response.writeHead(200);
				response.write(file, "binary");
				response.end(); 
			});
		});

	});

	server.listen(port, function(){
		console.log("Listen on port " +  port);
	});
}



module.exports = kubrick;
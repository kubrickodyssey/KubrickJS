var http = require('http'),
	colors = require('colors'),
	config = require('./config'),
	defaultFile = config.defaultFile || 'index.html',
	fs = require('fs'),
	kubrickResponse = require('./response'),
	path = require('path'),
	port = config.port || 3000,
	url = require('url');

module.exports = {
	Run : function(){
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
					response.writeHead(404, {"Content-Type": "text/plain"});
					response.write("404 Not Found!\n");
					response.end();
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
}
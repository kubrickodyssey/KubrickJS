var http = require('http'),
	appController = require('./app/controllers/controller'),
	morgan = require('morgan'),
	mvc = require('./kubrickMVC'),
	file_static = require('node-static'),
	fs = require('fs'),
	path = require('path');

var logger = morgan('dev');

var server = http.createServer(function(request, response){


	logger(request, response, function(err){

		if(err) throw err;

		var url = request.url.split('?')[0];
		var url_array = url.toString().split('/');
		url_array.shift();

		var controller = url_array.shift() || 'index';
		var view = url_array.shift() || 'index';
		var args = url_array;

		url = path.join(controller, view);

		for(var arg in args){
			url = path.join(url, args[arg]);
		}

		// Static Files


		var static_file_url = path.join(process.cwd(), 'public', url);

		if(fs.existsSync(static_file_url)){

			fs.readFile(static_file_url, function(err, file){
				if(!err){
					response.writeHead(200);
					response.write(file, "binary");
					response.end();
					return;
				}else{
					console.log("error");
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n" );
					response.end();
					return;
				}
			});

		}else{


			try{
				request.controller = controller;
				request.view = view;
				request.args = args;



				var objController = mvc.getController(controller);

				// console.log(objController);

				if(!objController) {
					var error = new Error('Not Found File');
					error.code = 404;

					throw error;
				}

				var fnController = new appController(request, response);


				args.unshift(function(responseController){
					responseController.response.writeHead(200, { 'Content-Type': 'text/html' });
					responseController.render(view);
					responseController.response.end();
				});

				objController[view].apply(fnController, args);
			}catch(ex){
				ex.code = ex.code || 500;
				var code = 500;

				if(ex.code == 404)
					code = 404;

				response.writeHead(code, { 'Content-Type': 'text/html' });
				
				var file_error = path.join(process.cwd(), 'app', 'views', 'errors', 'error.ejs');

				if(fs.existsSync(file_error)){
					var c = new appController(request, response);
					var error_html = fs.readFileSync(file_error);

					c.vars.error = ex;

					c.renderFile(error_html.toString(), c.vars);
					response.end();
				}else{
					response.end('Sorry');
				}
			}

		}
		

	});

});

server.listen(3000);
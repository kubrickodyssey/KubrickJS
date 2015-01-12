var path = require('path'),
	fs = require('fs');

function Kubrick(){
	var $this = this;
		_client_path = process.cwd(),
		_controller_path = path.join(process.cwd(), 'controllers'),
		_ip_address = '0.0.0.0',
		_port = '3000',
		customActions = [];


	var grep = function(items, callback) {
	    var filtered = [],
	        len = items.length,
	        i = 0;
	    for (i; i < len; i++) {
	        var item = items[i];
	        var cond = callback(item);
	        if (cond) {
	            filtered.push(item);
	        }
	    }

	    return filtered;
	};


	function isStaticRequest(request, isStatic){
		//Si la peticion es GET, es probable que busquemos un recurso estatico,
		//Lo Buscamos en la carpeta publica y si lo encontramos lo ruteamos como respuesta

		if(request.method == 'GET'){

			//Si el nombre del archivo es vacio, asignamos 'index.html' como nombre por default,
			//ya que la url '/' conducirial al directorio 'public/' y ya que este siempre existe
			//no podriamos continuar
			//la condicional deberia cambiarse por saber si es un directorio, y en caso afirmativo
			//asignar el valor por default como nombre de archivo, para que pueda aplicarse a todos
			//los directorios
			static_file_name = request.url;

			if(static_file_name == '/'){static_file_name = 'index.html';}

			var static_file_path = path.join(_client_path, 'public', static_file_name);

			fs.exists(static_file_path, function(exists){

				if(exists){
					isStatic(true, static_file_path);
				}else{
					isStatic(false, null);
				}				
			});

		}else{
			isStatic(false, null);
		}

		
	}

	function renderStaticFile(filePath, response){
		fs.readFile(filePath, function(err, file_buffer){
			response(err, file_buffer);
		});
	}

	this.onAction = function(controller, action, callback){
		customActions.push({
			controller: controller,
			action: action,
			callback: callback
		});
	}

	this.setControllerPath = function(folderPath){
		if(folderPath == null) throw new Error('folderPath arg is null');
		_controller_path = folderPath;
	}

	this.start = function(){

		var http = require('http'),
			async = require('async');
			BaseController = require('./baseController');

		var server = http.createServer(function(req, res){

			//Metodo de la peticion Http: GET, POST, PUT etc.
			var req_method = req.method;

			//Solo aceptamos los metodos GET y POST
			if(req_method == 'GET' || req_method == 'POST'){

				isStaticRequest(req, function(isStatic, filePath){

					if(isStatic){
						renderStaticFile(filePath, function(error, fileBuffer){
							if(error){

								res.write("Error");
								res.writeHead(500);
								res.end();
							}else{
								res.write(fileBuffer, "binary");
								res.end();
							}
						});
					}else{
						var url_split = req.url.toString().substring(1).split('/');

						var controller = url_split.shift() || 'index',
							action = url_split.shift() || 'index',
							args = url_split;


						var controller_file_path = path.join(_client_path, _controller_path, controller + '.js');

						fs.exists(controller_file_path, function(exists){

							var baseController;

							if(exists){

								var cController = require(controller_file_path);
								baseController = new BaseController(cController);

							}else{

								baseController = new BaseController();

							}

							baseController.action = action;
							baseController.view = action;
							baseController.controller = controller;
							baseController.args = args;


							var action_controller;

							if(typeof baseController[action] == 'undefined'){
								action_controller = baseController['default_action'];
							}else{
								action_controller = baseController[action];
							}


							args.unshift(function(actionError){
								if(actionError){
									// console.log(actionError);
									res.writeHead(500);
									res.end(actionError.message);
								}else{
									baseController.render(function(err, data){
										if(err){
											res.writeHead(500);
											res.end(err.message);
										}else{
											res.write(data);
											res.end();
										}
									});
								}
							});


							var cActions = grep(customActions, function(item){
								return item.controller == controller && item.action == action;
							});

							var asyncActions = [];

							for(var i in cActions){
								asyncActions.push(cActions[i].callback);
							}

							async.parallel(asyncActions, function(){
								action_controller.apply(baseController, args);
							});
							
						});


						// res.end(JSON.stringify({
						// 	controller: controller,
						// 	action: action,
						// 	args: args
						// }));

					}
					
				});

			}else{
				res.writeHeader(500);
				res.end('Metodo no aceptado');
			}
		});

		server.listen(_port, _ip_address, function(){
			console.info('Kubrick JS Running on http://%s:%s', _port, _ip_address);
		});
	}


}


module.exports = Kubrick;





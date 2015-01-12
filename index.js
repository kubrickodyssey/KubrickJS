var path = require('path'),
	fs = require('fs');

function Kubrick(){
	var $this = this;
		_client_path = process.cwd(),
		_controllerPath = '',
		_ip_address = '0.0.0.0',
		_port = '3000';


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

	this.setControllerPath = function(folderPath){
		_controllerPath = folderPath || path.join(_client_path, 'controllers');
	}

	this.start = function(){

		var http = require('http');

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


						res.end(JSON.stringify({
							controller: controller,
							action: action,
							args: args
						}));

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





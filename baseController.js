var path = require('path'),
	fs = require('fs');

function BaseController(customController){
	var controller = customController || {};
	for(var i in customController){
		this[i] = customController[i];
	}


	this.default_action = function(callback){

		//Aqui seteamos el modelo relacionado al controller action.

		console.info('Ejecutando accion por defecto');

		var existe_modelo = true; //Comprobar si existe !!

		if(existe_modelo){
			callback();
		}else{
			callback(new Error('Modelo No Existe'));
		}
	}

	this.render = function(callback){

		var view_path = path.join(process.cwd(), 'views', this.view + 'ejs');

		fs.exists(view_path, function(exists){

			if(exists){
				fs.readFile(view_path, function(err, data){
					callback(err, data);
				});
			}else{

				view_path = path.join(__dirname, 'views', 'default.ejs');
				fs.exists(view_path, function(exists){
					if(exists){
						fs.readFile(view_path, function(err, data){
							callback(err, data);
						});
					}else{
						var error = new Error('No existe la vista por defecto');
						callback(error, null);
					}
				});

			}
		});

	}
}


module.exports = BaseController;
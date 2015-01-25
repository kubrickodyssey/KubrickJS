var path = require('path'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

function BaseController(customController){

	//	Heredar metodos y propiedades
	var controller = customController || {};
	for(var i in customController){
		this[i] = customController[i];
	}

	var $this = this;

	this.vars = {};

	this.loadModels = function(callback){

		var modelsDir = path.join(process.cwd(), 'models');

		fs.readdir(modelsDir, function(error, dirs){

			if(error){
				callback(error, null);
				return;
			}

			var models = {};

			var db = mongoose.createConnection("localhost", "kubrickDev");

			db.on("error", function(err){
				callback(err, null);
			});
			db.once("open", function(argument){

					for(var i in dirs){

						if(dirs[i].indexOf(".js") > 0){
							var modelFile = path.join(process.cwd(), "models", dirs[i]);
							var tmpSchema = require(modelFile)(mongoose.Schema);

							var schema = new Schema(tmpSchema);

							var modelName = dirs[i].replace(".js", "");

							var tmpModel;

							try{
								 tmpModel = db.model(modelName);
							}catch(e){
								try{
									tmpModel = db.model(modelName, schema);
								}catch(e){};
							}


							models[modelName] = tmpModel;
						}
					}

					callback(null, models);
			});

		});
	}


	this.default_action = function(callback){

		console.log("default action");
		callback();

	}

	this.render = function(callback){


		var view_path = path.join(process.cwd(), 'views',this.controller, this.view + '.ejs');
		// console.log(view_path);
		fs.exists(view_path, function(exists){

			var ejs = require("ejs");


			if(exists){
				fs.readFile(view_path, function(err, data){



					callback(err, ejs.render(data.toString("utf-8"), $this.vars));
				});
			}else{

				view_path = path.join(__dirname, 'views', 'default.ejs');
				fs.exists(view_path, function(exists){
					if(exists){
						fs.readFile(view_path, function(err, data){

							//console.log($this.vars);

							callback(err, ejs.render(data.toString("utf-8"), $this.vars));
						});
					}else{
						var error = new Error('No existe la vista por defecto');
						callback(error, null);
					}
				});

			}
		});

	}

	this.set = function(varName, varValue){
		$this.vars[varName] = varValue;
	}
}


module.exports = BaseController;

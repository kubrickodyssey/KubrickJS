var fs = require('fs'),
	path = require('path');

module.exports.getAction = function(controllerName, viewName){
	if(!typeof(controllerName) === 'String'){
		throw new Error('Invalid Controller Name');
	}

	var file_path = path.join(process.cwd(), 'app', 'controllers', controllerName + '.js');
	var exists = fs.existsSync(file_path);

	if(exists){
		var response = require(file_path);
		if(typeof(response[viewName]) == 'function') return response[viewName];
		//return response[viewName];
	}
	return false;

}
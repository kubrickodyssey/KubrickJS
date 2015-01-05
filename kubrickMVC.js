var fs = require('fs'),
	path = require('path');

module.exports.getController = function(controllerName){
	if(!typeof(controllerName) === 'String'){
		throw new Error('Invalid Controller Name');
	}

	var file_path = path.join(process.cwd(), 'app', 'controllers', controllerName + '.js');
	var exists = fs.existsSync(file_path);

	if(exists){
		var response = require(file_path);
		if(typeof(response[controllerName]) == 'object') return response[controllerName];
	}
	return false;
}
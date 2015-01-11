var path = require('path'),
	Helper = require('../helpers');


module.exports = function(req, res){

	this.renderFile = function(file_path, view_args){
		var ejs = require('ejs');
		ejs.open = '<%';
		ejs.close = '%>';
		var html = ejs.render(file_path, view_args);
		res.write(html);
	}

	this.render = function(view){




		var ejs = require('ejs');

		ejs.open = '<%';
		ejs.close = '%>';

		var fs = require('fs');
		var path = require('path');

		var html = '';

		var file = path.join(process.cwd(), 'app', 'views', this.request.controller, view + '.ejs');
		
		var file_exists = fs.existsSync(file);

		console.log(file);

		if(file_exists){

			// this.response.write('exite');

			var file_read = fs.readFileSync(file);
			var file_html = file_read.toString();

			var layout = file_html.match("{{layout=(.*)}}") ;
			
			this.vars['body'] = file_html;
			
			

			var layout_html = '<%- body %>';
			if(layout !== null && layout[1] !== ''){
				var body_html = file_html.replace(layout[0], '');
				this.vars['body'] = ejs.render(body_html, this.vars);
				var layout_file = path.join(process.cwd(), 'app', 'views', layout[1] + '.ejs');
				var layout_file_read = fs.readFileSync(layout_file);
				layout_html = layout_file_read.toString();
			}


			var rs = ejs.render(layout_html,  this.vars);
			res.write(rs);
		}else{

			var error = new Error('View File Not Found');
			error.code = 1001;
			error['resource_lost'] = file;
			console.error(error);
			throw error;
		}
	}

	this.request = req;
	this.response = res;

	this.set = function(nombre, value){
		this.vars[nombre] = value;
	}

	this.vars = {
		assets: function(strPath){
			return path.join('/', 'assets', strPath) ;
		},
		helper: new Helper(req),
		site_title: 'Kb'
	};

}
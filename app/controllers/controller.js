var path = require('path'),
	_url = require('url');


module.exports = function(req, res){

	this.render = function(){

		var ejs = require('ejs');

		ejs.open = '<%';
		ejs.close = '%>';

		var fs = require('fs');
		var path = require('path');

		var html = '';

		var file = path.join(process.cwd(), 'app', 'views', this.request.controller, this.request.view + '.ejs');
		
		var file_read = fs.readFileSync(file);
		var file_html = file_read.toString();

		var layout = file_html.match("{{layout=(.*)}}");
		
		this.vars['body'] = file_html;
		

		

		var layout_html = '';
		if(layout !== null && layout[1] !== ''){
			var body_html = file_html.replace(layout[0], '');
			this.vars['body'] = ejs.render(body_html, this.vars);
			var layout_file = path.join(process.cwd(), 'app', 'views', layout[1] + '.ejs');
			var layout_file_read = fs.readFileSync(layout_file);
			layout_html = layout_file_read.toString();
			
			// html = ejs.render
		}
		// else{
		// 	html = file_html;
		// }




		var rs = ejs.render(layout_html,  this.vars);
		res.write(rs);
	}

	this.request = req;
	this.response = res;

	this.set = function(nombre, value){
		this.vars[nombre] = value;
	}

	this.vars = {
		assets: function(strPath){
			return path.join('/', 'assets', strPath) ;
		}
	};


	this.html = {
		url: function(url_options){
			var controller = url_options.controller || '';
			var view = url_options.action || '';
			var args = url_options.args || [];

			var this_url = _url.resolve('/', request.headers.host + '/');
			this_url = _url.resolve(this_url, controller + '/');
			this_url = _url.resolve(this_url, view + '/');

			for(var i in args)
			{
				this_url = _url.resolve(this_url, args[i] + '/');
			}

			return this_url;
		}
	}

}
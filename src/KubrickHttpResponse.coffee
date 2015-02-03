class KubrickHttpResponse
	ejs = require "ejs"
	fs = require "fs"
	mime = require "mime"

	constructor: (@httpResponse)->

	renderError: (errorNumber)->
		this.httpResponse.writeHead errorNumber
		this.httpResponse.write "Error #{errorNumber}"
		this.httpResponse.end()
		return

	renderStatic: (filePath)->
		_this = this
		fs.readFile filePath, (error, fileBuffer)->

			if error
				this.renderError(500);
				return


			file_mime = mime.lookup filePath
			_this.httpResponse.writeHead 200, {"Content-Type": file_mime}
			if file_mime == "text/html"
				html_string = fileBuffer.toString()
				html_string = ejs.render html_string

				_this.httpResponse.write html_string;
			else
				_this.httpResponse.write(fileBuffer);

			
			_this.httpResponse.end()
			return



module.exports = KubrickHttpResponse
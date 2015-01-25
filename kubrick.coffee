
###
# Class: Kubrick
# Constructor Params:
# 		@configs: define de general settings for the application
###
ejs = require "ejs"
fs = require "fs"
http = require "http"
mime = require "mime"
path = require "path"
url = require "url"

class Kubrick
	constructor: (@configs)->
		### if configs param is null then param is set to blank object ###
		config = @configs ? {}
		@port = config.port

	run: (callback)->
		_this = this
		
		server = http.createServer this.action

		server.listen this.port, ()->
			console.log "Kubrick Http Server Running in port #{_this.port}"
			callback()
			return
		return


	action: (httpRequest, httpResponse)->

		### logging al http requests ###
		morgan = require "morgan" 
		logger = morgan("dev")
		logger httpRequest, httpResponse, (err)->
			if err
				console.error err

		### Kubrick Application logic ###

		kubrickRequest = new Kubrick.HttpRequest httpRequest
		kubrickResponse = new Kubrick.httpResponse httpResponse
		kubrickUrl = new Kubrick.Url httpRequest


		if kubrickUrl.isStatic()
			console.log "is Static"
			kubrickResponse.renderStatic(kubrickUrl.staticPath())
		else
			console.log "isnt Static"

		return

class Kubrick.HttpRequest
	constructor: (httpRequest)->
		

class Kubrick.httpResponse
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

class Kubrick.Url

	constructor: (httpRequest)->

		url_array = url.parse httpRequest.url

		url_split = url_array.path.split "/"
		url_split.shift()

		@hostname = httpRequest.headers.host
		@controller = url_split.shift() || "index"
		@action = url_split.shift() || "index"
		@args = url_split


		@path = url_array.path

	isStatic: ()->
		if fs.existsSync @staticPath()
			return true
		else
			return false


	staticPath: ()->
		dirPath = path.join __dirname, "public"

		if fs.existsSync dirPath
			filePath = path.join dirPath, this.path 
			if fs.statSync(filePath).isDirectory()
				filePath = path.join filePath, "index.html"
			return filePath
		else
			fs.mkdirSync dirPath
			return @staticPath()
		return




configs = {
	port: 3000,
	publicFolder: "public"
}
kubrick = new Kubrick(configs)
kubrick.run(()->
	console.log "Server is Running"
	return
)
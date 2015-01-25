
###
# Class: Kubrick
# Constructor Params:
# 		@configs: define de general settings for the application
###

fs = require "fs"
http = require "http"
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

	renderStatic: (filePath)->
		_this = this
		fs.readFile filePath, (error, binaryFile)->
			_this.httpResponse.write(binaryFile);
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
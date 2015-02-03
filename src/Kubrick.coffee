class Kubrick
	colors = require "colors"
	http = require "http"
	socketio = require "socket.io"

	Kubrick.Model = require "./KubrickModel"
	Kubrick.Url = require "./KubrickUrl"
	Kubrick.HttpRequest = require "./KubrickHttpRequest"
	Kubrick.HttpResponse = require "./KubrickHttpResponse"


	colors.setTheme {
		silly: 'rainbow',
		input: 'grey',
		verbose: 'cyan',
		prompt: 'grey',
		info: 'cyan',
		data: 'grey',
		help: 'cyan',
		warn: 'yellow',
		debug: 'blue',
		error: 'red',
		success: "green"
	}

	constructor: (@configs)->
		config = @configs ? {}
		@port = config.port

	run: (callback)->
		_this = this
		server = http.createServer this.action

		server.listen this.port, ()->
			console.log "Kubrick Http Server Running in port #{_this.port}".success
			### callback custom function after server is listening ###
			callback()
			return

		### Implementing Socket I/O ###
		io = socketio server
		io.on "conection", (socket)->
			console.log "connected to Socket I/O"
			socket.emit "connected", {}
			return #socket on connection
		return # this (run) function


	action: (httpRequest, httpResponse)->

		### logging al http requests ###
		morgan = require "morgan" 
		logger = morgan("dev")
		logger httpRequest, httpResponse, (err)->
			if err
				console.error err
				return

		### Kubrick Application logic ###

		kubrickRequest = new Kubrick.HttpRequest httpRequest
		kubrickResponse = new Kubrick.HttpResponse httpResponse
		kubrickUrl = new Kubrick.Url httpRequest



		### If is istatic render this and omite a mvc & orm function ###
		if kubrickUrl.isStatic()
			console.log "is Static".info
			kubrickResponse.renderStatic(kubrickUrl.staticPath())
		else
			console.log "isnt Static"

			return
module.exports = Kubrick





class KubrickUrl
	fs = require "fs"
	path = require "path"
	url = require "url"
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

		console.log @staticPath()

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

		### function end ###
		return 


module.exports = KubrickUrl
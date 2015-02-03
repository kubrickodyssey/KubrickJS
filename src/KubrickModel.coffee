class KubrickModel
	
	QueryBuilder = require "./QueryBuilder"
	

	constructor: (@table)->

	find: (options, callback)->

		options.table = @table
		options.type = "select"

		q = new QueryBuilder options
		queryString = q.build()

		
		mysql = require "mysql"
		connection = mysql.createConnection {
			host: "localhost",
			user: "root",
			password: "",
			database: "nodejs"
		}

		connection.query queryString, (err, rows, fields)->
			if err
				callback err, null, null
				return

			callback null, rows, fields
			return	

		return


module.exports = KubrickModel
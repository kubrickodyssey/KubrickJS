class QueryBuilder
	constructor: (options)->
		@type = options.type
		@table = options.table
		@fields = options.fields
		@conditions = options.conditions
		return

	build: ()->
		query = ""

		if @type == "select"
				query = "SELECT "
				for field in @fields
					query += "#{field}, "

				query = query.slice 0, query.lastIndexOf ","
		
				query += " FROM #{@table} "

				for condKey, condVal of @conditions
					for key, value of condVal
						if condKey.toString() == "0"
							query += " WHERE (#{key} = #{value})"
						else
							query += " AND (#{key} = #{value})"
					

		return query + ";"


module.exports = QueryBuilder
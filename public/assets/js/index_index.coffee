(($) ->

	

	$(document).ready ()->
		socket = io()
		socket.emit "data.find", {
			model: "users",
			conditions: {
				nombre: "admin"
			}
		}
		socket.on "data.findResponse", (user)->
			console.log user
			return
		return
	return
) jQuery

module.exports = function(response){
	response.redirect = function(uri){
		console.log("Redirect to " + uri);
		this.writeHead(302, {Location: uri});
		this.end();
	}

	return response;
}



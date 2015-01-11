var config = require('./config'),
	fs = require('fs'),
	sqlite3 = require('sqlite3').verbose(),
	dbFile = 'kubrick.db';



var exists = fs.existsSync(dbFile);
var db = new sqlite3.Database(dbFile);


db.serialize(function(){
	if(!exists){
		db.run("CREATE TABLE modules (id INTEGER PRIMARY KEY AUTOINCREMENT,"
				.concat("name TEXT NOT NULL,")
				.concat("url TEXT NOT NULL,")
				.concat("display_name TEXT NOT NULL);"));


	}
});
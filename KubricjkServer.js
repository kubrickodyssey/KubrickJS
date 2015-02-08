/*
 *  Classes
 */

var KubrickRequest = require("./bin/KubrickRequest");


/*
 *  VAR definitions
 */
var http = require("http");


var server = http.createServer(function(request, response) {
    //Convertimos el http request en kubrickRequest y obtener datos necesarios
    //para el ruteo de controladores y archivos
    var kRequest = new KubrickRequest(request);
    
    
    
});

server.listen(process.env.PORT);

/*
 *  Classes
 */

var KubrickRequest = require("./bin/KubrickRequest"),
    KubrickCommons = require("./bin/KubrickCommons"),
    KubrickLogger = require("./bin/KubrickLogger"),
    KubrickResponse = require("./bin/KubrickResponse");


/*
 *  VAR definitions
 */
var http = require("http"),
    ejs = require("ejs"),
    fs = require("fs"),
    path = require("path");

global.console._log = console.log;


global.console.log = KubrickLogger.log;
global.console.error = KubrickLogger.error;
global.console.warn = KubrickLogger.warning;
global.console.info = KubrickLogger.info;

var server = http.createServer(function(request, response) {
    //Convertimos el http request en kubrickRequest y obtener datos necesarios
    //para el ruteo de controladores y archivos
    var kRequest = new KubrickRequest(request);
    var kResponse = new KubrickResponse(response);
    
    
    var afterRender = function(err, path, mime_type, fileBuffer){
        if(err) throw err;
        
        response.writeHead(200, {
            "Content-Type": mime_type
        });
        
        if(mime_type == "text/html"){
            var result = ejs.render(fileBuffer.toString(), {});
            response.write(result);
        }else{
            response.write(fileBuffer);
        }
        
        
        response.end();  
    };
    
    
    KubrickCommons.isValidPath(kRequest.localPath(), function(exist, path){
       //validPath = true ? es un archivo estatico y lo servimos
        if(exist){
            console.log("Es estatico");
            kResponse.renderStatic(path, afterRender);
        }else{
            console.log(path);
            console.error("No es estatico");
        } 
    });
    
});



server.listen(process.env.PORT);

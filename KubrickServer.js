/*
 *  Classes
 */

var KubrickRequest = require("./bin/KubrickRequest"),
    KubrickCommons = require("./bin/KubrickCommons"),
    KubrickLogger = require("./bin/KubrickLogger"),
    KubrickResponse = require("./bin/KubrickResponse"),
    KubrickAuth = require("./bin/KubrickAuth");


/*
 *  VAR definitions
 */
var http = require("http"),
    ejs = require("ejs"),
    fs = require("fs"),
    path = require("path"),
    sessionManager = require("session-manager");

global.console._log = console.log;


global.console.log = KubrickLogger.log;
global.console.error = KubrickLogger.error;
global.console.warn = KubrickLogger.warning;
global.console.info = KubrickLogger.info;

var sm = sessionManager.create({engine: 'memory'});

var server = http.createServer(function(request, response) {
    
    
    global.KSession = sm.start(request, response);
    
    //KSession.set("isAuthenticated", true);
    
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
    
    //Security Actions
    var kAuth = new KubrickAuth();
    if(kRequest.controller == "login" && kRequest.action == "index"){
        if(request.method == "POST"){
            kAuth.login(request, function(err, success){
                var location = "/";
                
                location = KSession.get("referer") || "/";
                
                if(err || !success){
                    console.log("Autenticacion fallida");
                    location = "/login";
                }
                
                response.writeHead(302, {
                    "Location": location
                });
                response.end();
                
            });
        }else{
            var loginView = "./bin/views/layouts/login.html";
            kResponse.renderStatic(loginView, afterRender);
            return;
        }
    }else{
        
        kAuth.isAuthenticated(function(err, isAuthenticated){
            if(err){
                console.warn("ocurrio un error");
                console.error(err);
                isAuthenticated = false;
            }
            if(!isAuthenticated){
                console.warn("No fue autenticado, redireccionando a ~/login");
                
                if(!(KSession.get("referer") || false)){
                    KSession.set("referer", kRequest.here());
                }
                
                
                
                response.writeHead(302, {
                    "Location": "/login"
                });
                response.end();
                return;
            }else{
                
                KSession.set("referer", false);
                
                console.log("Esta autenticado, es usuario valido");
                KubrickCommons.isValidPath(kRequest.localPath(), function(exist, path){
                   //validPath = true ? es un archivo estatico y lo servimos
                    if(exist){
                        console.log("Es estatico");
                        kResponse.renderStatic(path, afterRender);
                    }else{
                        console.log(path);
                        console.error("No es estatico");
                        response.writeHead(404);
                        afterRender(null, null, "text/plain", "Error 404");
                    } 
                });
            }
        });
        
    }
    
    
    
    
    
});



server.listen(process.env.PORT);

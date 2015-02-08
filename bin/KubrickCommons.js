var KubrickCommons;

var fs = require("fs"),
    path = require("path");

KubrickCommons = function(){
    
};

KubrickCommons.isValidPath = function(p, cb){
    console.warn("Solicitando recurso " + p);
    if(fs.existsSync(p)){
        console.info("Path existe en el sistema de archivos");
        if(!fs.lstatSync(p).isDirectory()){
            console.info("Path no es un directorio");
            cb(true, p);
        }else{
            console.info("Path es un directorio");
            
            //Cuando se trate de un directorio se busca un archivo index
            
            console.info("Buscando Archivo index.html");
            var indexPath = path.join(p, "index.html");
            
            //Recursividad
            KubrickCommons.isValidPath(indexPath, cb);
        }
        
    }else{
        console.info("Path no existe");
        cb(false, p);
    }
};


module.exports = KubrickCommons;
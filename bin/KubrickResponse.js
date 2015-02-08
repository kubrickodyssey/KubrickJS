var KubrickResponse;

var _response,
    mime = require("mime"),
    fs = require("fs");

KubrickResponse = function(response){
    _response = response;
};


KubrickResponse.prototype.renderStatic = function(p, cb){
    var mime_type = mime.lookup(p);
    fs.readFile(p, function(err, fileBuffer){
        cb(err, p, mime_type, fileBuffer);
    });
};


module.exports = KubrickResponse;
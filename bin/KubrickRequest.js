/*
 *  Is a HTTP request extension for KubrickJS
 *  obtain url options for url routing
 */

var KubrickRequest;
 
var path = require("path"),
    processPath,
    url = require("url");

KubrickRequest = function(request){
    
    this.url_array = url.parse(request.url);
    var url_parsed = this.urlPath().split("/");
    
    url_parsed.shift();
    this.controller = url_parsed.shift() || "index";
    this.action = url_parsed.shift() || "index";
    this.args = url_parsed;
    
    processPath = process.cwd();
    
};


KubrickRequest.prototype.localPath = function(){
    return path.join(processPath, "www", this.urlPath());
};

KubrickRequest.prototype.here = function(){
    return this.url_array.href;
};

KubrickRequest.prototype.urlPath = function(){
    return this.url_array.pathname;
};


module.exports = KubrickRequest;
/*
 *  Is a HTTP request extension for KubrickJS
 *  obtain url options for url routing
 */
var KubrickRequest,
    action,
    args,
    controller,
    path = require("path"),
    processPath,
    url = require("url"),
    url_array;

KubrickRequest = function(request){
    url_array = url.parse(request.url);
    var url_parsed = this.urlPath().split("/");
    
    url_parsed.shift();
    controller = url_parsed.shift() || "index";
    action = url_parsed.shift() || "index";
    args = url_parsed;
    
    processPath = process.cwd();
    
};

KubrickRequest.prototype.action = function(){
    return action;
};

KubrickRequest.prototype.args = function(){
    return args;
};

KubrickRequest.prototype.controller = function(){
    return controller;
};

KubrickRequest.prototype.localPath = function(){
    return path.join(processPath, "www", this.urlPath());
};

KubrickRequest.prototype.here = function(){
    return url_array.href;
};

KubrickRequest.prototype.urlPath = function(){
    return url_array.pathname;
};


module.exports = KubrickRequest;
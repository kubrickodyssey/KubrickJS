var KubrickLogger;

var colors = require("colors");

KubrickLogger = function(){
    
};


KubrickLogger.error = function(msg){
    console._log(format(msg).toString().bgRed);
};

KubrickLogger.info = function(msg){
    console._log(format(msg).toString());
};

KubrickLogger.log = function(msg){
    console._log(format(msg).toString().green);
};

KubrickLogger.warning = function(msg){
    console._log(format(msg).toString().yellow);
};


var format = function(msg){
    return getDateTime().toString().concat("    ").concat(msg);
};

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

};


module.exports = KubrickLogger;
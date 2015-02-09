var KubrickAuth;


var Model = require("./KubrickModel"),
    multiparty = require("multiparty");

KubrickAuth = function(){
    
};


KubrickAuth.prototype.isAuthenticated = function(cb){
    var isAuthenticated = this.getSession("isAuthenticated", false);
    cb(null, isAuthenticated);
};

KubrickAuth.prototype.login = function(request, cb){
    var form = new multiparty.Form();
    form.parse(request, function(err, fields, files){
        if(err){
            cb(err, false);
        }else{
            
            var username = fields.username[0] || "";
            var password = fields.password[0] || "";
            
            var userModel = new Model("users");
            userModel.exists({
                conditions: {
                    username: username,
                    password: password
                }
            }, function(err, exists){
                if(err) {
                    cb(err, false);
                }else{
                    var result = Boolean(exists);
                    if(result == true){
                        KSession.set("isAuthenticated", true);
                    } 
                    cb(null, result);   
                }
            });
            
        }
        
    });
    
   
};


KubrickAuth.prototype.getSession = function(key, defaultValue){
    var result =  KSession.get(key) ;
    result = result|| defaultValue;
    return result;
}

module.exports = KubrickAuth;
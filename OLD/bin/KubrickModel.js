var KubrickModel;


var mysql = require("mysql");

KubrickModel = function(modelName){
    this.modelName = modelName;
    this.connection = mysql.createConnection({
        host: "172.17.47.77",
        user: "jahenn1",
        database: "c9"
    });
};

function QueryBuilder(options){
    
    var pd = require("./ext/pretty-data/pretty-data.js").pd;
    
    switch (options.type) {
        case 'exists':
            
            var _query = "SELECT EXISTS(SELECT id from "
                .concat(options.model).concat(" WHERE ");
            
            var _i = 0;
            for(var i in options.conditions){
                _i++;
                if(_i > 1){
                    _query = _query.concat(" AND ");
                }
                
                var _condition = options.conditions[i];
                
                switch (typeof(_condition)) {
                    case 'string':
                        _condition = "'".concat(_condition).concat("'");
                        break;
                    
                    default:
                        _condition = _condition;
                }
                
                
                _query = _query.concat("(")
                                .concat(i)
                                .concat(" = ")
                                .concat(_condition)
                                .concat(")");
                                
            }
            
            _query = _query.concat(" LIMIT 1) AS _exists; ");
            
            _query = pd.sql(_query);
            this.query = _query;
            break;
        default:
            this.query = ";";
    }
    
}

KubrickModel.prototype.exists = function(opts, cb){
    var options = opts || {},
        _conditions = options.conditions || {};
        
    options.conditions = _conditions,
    options.type = "select";
    
    var Query = new QueryBuilder({
       type: "exists",
       conditions: options.conditions,
       model: this.modelName
    });
    
    console._log(Query.query.toString());
    
    this.connection.query(Query.query.toString(), function(err, rows, fields){
        if(err){
            cb(err, false);
        }else{
            var respuesta = false;
            if(rows.length >= 1){
                if(rows[0]._exists == 1){
                    respuesta = true;
                }
            }
            
            cb(null, respuesta);   
        }
    });
    
};




module.exports = KubrickModel;
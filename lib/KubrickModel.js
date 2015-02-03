var KubrickModel;

KubrickModel = (function() {
  var QueryBuilder;

  QueryBuilder = require("./QueryBuilder");

  function KubrickModel(table) {
    this.table = table;
  }

  KubrickModel.prototype.find = function(options, callback) {
    var connection, mysql, q, queryString;
    options.table = this.table;
    options.type = "select";
    q = new QueryBuilder(options);
    queryString = q.build();
    mysql = require("mysql");
    connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "nodejs"
    });
    connection.query(queryString, function(err, rows, fields) {
      if (err) {
        callback(err, null, null);
        return;
      }
      callback(null, rows, fields);
    });
  };

  return KubrickModel;

})();

module.exports = KubrickModel;

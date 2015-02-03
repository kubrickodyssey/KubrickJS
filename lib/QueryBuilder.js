var QueryBuilder;

QueryBuilder = (function() {
  function QueryBuilder(options) {
    this.type = options.type;
    this.table = options.table;
    this.fields = options.fields;
    this.conditions = options.conditions;
    return;
  }

  QueryBuilder.prototype.build = function() {
    var condKey, condVal, field, key, query, value, _i, _len, _ref, _ref1;
    query = "";
    if (this.type === "select") {
      query = "SELECT ";
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        field = _ref[_i];
        query += "" + field + ", ";
      }
      query = query.slice(0, query.lastIndexOf(","));
      query += " FROM " + this.table + " ";
      _ref1 = this.conditions;
      for (condKey in _ref1) {
        condVal = _ref1[condKey];
        for (key in condVal) {
          value = condVal[key];
          if (condKey.toString() === "0") {
            query += " WHERE (" + key + " = " + value + ")";
          } else {
            query += " AND (" + key + " = " + value + ")";
          }
        }
      }
    }
    return query + ";";
  };

  return QueryBuilder;

})();

module.exports = QueryBuilder;

var Kubrick;

Kubrick = (function() {
  var colors, http, socketio;

  colors = require("colors");

  http = require("http");

  socketio = require("socket.io");

  Kubrick.Model = require("./KubrickModel");

  Kubrick.Url = require("./KubrickUrl");

  Kubrick.HttpRequest = require("./KubrickHttpRequest");

  Kubrick.HttpResponse = require("./KubrickHttpResponse");

  colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'cyan',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    success: "green"
  });

  function Kubrick(configs) {
    var config, _ref;
    this.configs = configs;
    config = (_ref = this.configs) != null ? _ref : {};
    this.port = config.port;
  }

  Kubrick.prototype.run = function(callback) {
    var server, _this;
    _this = this;
    server = http.createServer(this.a);
    return server.listen(this.port, function() {
      console.log(("Kubrick Http Server Running in port " + _this.port).success);

      /* callback custom function after server is listening */
      callback();
    });
  };

  return Kubrick;

})();

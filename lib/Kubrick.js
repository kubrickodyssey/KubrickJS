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
    var io, server, _this;
    _this = this;
    server = http.createServer(this.action);
    server.listen(this.port, function() {
      console.log(("Kubrick Http Server Running in port " + _this.port).success);

      /* callback custom function after server is listening */
      callback();
    });

    /* Implementing Socket I/O */
    io = socketio(server);
    io.on("conection", function(socket) {
      console.log("connected to Socket I/O");
      socket.emit("connected", {});
    });
  };

  Kubrick.prototype.action = function(httpRequest, httpResponse) {

    /* logging al http requests */
    var kubrickRequest, kubrickResponse, kubrickUrl, logger, morgan;
    morgan = require("morgan");
    logger = morgan("dev");
    logger(httpRequest, httpResponse, function(err) {
      if (err) {
        console.error(err);
      }
    });

    /* Kubrick Application logic */
    kubrickRequest = new Kubrick.HttpRequest(httpRequest);
    kubrickResponse = new Kubrick.HttpResponse(httpResponse);
    kubrickUrl = new Kubrick.Url(httpRequest);

    /* If is istatic render this and omite a mvc & orm function */
    if (kubrickUrl.isStatic()) {
      console.log("is Static".info);
      return kubrickResponse.renderStatic(kubrickUrl.staticPath());
    } else {
      console.log("isnt Static");
    }
  };

  return Kubrick;

})();

module.exports = Kubrick;

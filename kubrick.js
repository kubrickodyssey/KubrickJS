
/*
 * Class: Kubrick
 * Constructor Params:
 * 		@configs: define de general settings for the application
 */

(function() {
  var Kubrick, configs, ejs, fs, http, kubrick, mime, path, socketio, url;

  ejs = require("ejs");

  fs = require("fs");

  http = require("http");

  mime = require("mime");

  path = require("path");

  socketio = require("socket.io");

  url = require("url");

  Kubrick = (function() {
    function Kubrick(configs) {
      var config, _ref;
      this.configs = configs;

      /* if configs param is null then param is set to blank object */
      config = (_ref = this.configs) != null ? _ref : {};
      this.port = config.port;
    }

    Kubrick.prototype.run = function(callback) {
      var io, server, _this;
      _this = this;

      /* Creating server and redirect action to this.action */
      server = http.createServer(this.action);
      server.listen(this.port, function() {
        console.log("Kubrick Http Server Running in port " + _this.port);

        /* callback custom function after server is listening */
        callback();
      });

      /* Implementing Socket I/O */
      io = socketio(server);
      io.on("connection", function(socket) {
        console.log("connected to Socket I/O");
        socket.on("data.find", function(msg) {
          var model;
          console.log(msg);

          /* Model simulation for test purposes */
          model = {
            modelName: msg.model,
            fields: [
              {
                _id: 1,
                _v: 4
              }, {
                _id: 2,
                _v: 2
              }, {
                _id: 2,
                _v: 3
              }
            ]
          };
          socket.emit("data.findResponse", model);
        });
      });
    };

    Kubrick.prototype.action = function(httpRequest, httpResponse) {

      /* logging al http requests */
      var kubrickRequest, kubrickResponse, kubrickUrl, logger, morgan;
      morgan = require("morgan");
      logger = morgan("dev");
      logger(httpRequest, httpResponse, function(err) {
        if (err) {
          return console.error(err);
        }
      });

      /* Kubrick Application logic */
      kubrickRequest = new Kubrick.HttpRequest(httpRequest);
      kubrickResponse = new Kubrick.httpResponse(httpResponse);
      kubrickUrl = new Kubrick.Url(httpRequest);

      /* If is istatic render this and omite a mvc & orm function */
      if (kubrickUrl.isStatic()) {
        console.log("is Static");
        kubrickResponse.renderStatic(kubrickUrl.staticPath());
      } else {
        console.log("isnt Static");
      }
    };

    return Kubrick;

  })();

  Kubrick.HttpRequest = (function() {
    function HttpRequest(httpRequest) {}

    return HttpRequest;

  })();

  Kubrick.httpResponse = (function() {
    function httpResponse(httpResponse) {
      this.httpResponse = httpResponse;
    }

    httpResponse.prototype.renderError = function(errorNumber) {
      this.httpResponse.writeHead(errorNumber);
      this.httpResponse.write("Error " + errorNumber);
      this.httpResponse.end();
    };

    httpResponse.prototype.renderStatic = function(filePath) {
      var _this;
      _this = this;
      return fs.readFile(filePath, function(error, fileBuffer) {
        var file_mime, html_string;
        if (error) {
          this.renderError(500);
          return;
        }
        file_mime = mime.lookup(filePath);
        _this.httpResponse.writeHead(200, {
          "Content-Type": file_mime
        });
        if (file_mime === "text/html") {
          html_string = fileBuffer.toString();
          html_string = ejs.render(html_string);
          _this.httpResponse.write(html_string);
        } else {
          _this.httpResponse.write(fileBuffer);
        }
        return _this.httpResponse.end();
      });
    };

    return httpResponse;

  })();

  Kubrick.Url = (function() {
    function Url(httpRequest) {
      var url_array, url_split;
      url_array = url.parse(httpRequest.url);
      url_split = url_array.path.split("/");
      url_split.shift();
      this.hostname = httpRequest.headers.host;
      this.controller = url_split.shift() || "index";
      this.action = url_split.shift() || "index";
      this.args = url_split;
      this.path = url_array.path;
    }

    Url.prototype.isStatic = function() {
      if (fs.existsSync(this.staticPath())) {
        return true;
      } else {
        return false;
      }
    };

    Url.prototype.staticPath = function() {
      var dirPath, filePath;
      dirPath = path.join(__dirname, "public");
      if (fs.existsSync(dirPath)) {
        filePath = path.join(dirPath, this.path);
        if (fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, "index.html");
        }
        return filePath;
      } else {
        fs.mkdirSync(dirPath);
        return this.staticPath();
      }
    };

    return Url;

  })();

  configs = {
    port: 3000,
    publicFolder: "public"
  };

  kubrick = new Kubrick(configs);

  kubrick.run(function() {
    console.log("Server is Running");
  });

}).call(this);

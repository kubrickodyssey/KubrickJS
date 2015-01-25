
/*
 * Class: Kubrick
 * Constructor Params:
 * 		@configs: define de general settings for the application
 */

(function() {
  var Kubrick, configs, fs, http, kubrick, path, url;

  fs = require("fs");

  http = require("http");

  path = require("path");

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
      var server, _this;
      _this = this;
      server = http.createServer(this.action);
      server.listen(this.port, function() {
        console.log("Kubrick Http Server Running in port " + _this.port);
        callback();
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

    httpResponse.prototype.renderStatic = function(filePath) {
      var _this;
      _this = this;
      return fs.readFile(filePath, function(error, binaryFile) {
        _this.httpResponse.write(binaryFile);
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

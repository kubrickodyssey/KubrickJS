var KubrickUrl;

KubrickUrl = (function() {
  var fs, path, url;

  fs = require("fs");

  path = require("path");

  url = require("url");

  function KubrickUrl(httpRequest) {
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

  KubrickUrl.prototype.isStatic = function() {
    console.log(this.staticPath());
    if (fs.existsSync(this.staticPath())) {
      return true;
    } else {
      return false;
    }
  };

  KubrickUrl.prototype.staticPath = function() {
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

    /* function end */
  };

  return KubrickUrl;

})();

module.exports = KubrickUrl;

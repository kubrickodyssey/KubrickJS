var KubrickHttpResponse;

KubrickHttpResponse = (function() {
  var ejs, fs, mime;

  ejs = require("ejs");

  fs = require("fs");

  mime = require("mime");

  function KubrickHttpResponse(httpResponse) {
    this.httpResponse = httpResponse;
  }

  KubrickHttpResponse.prototype.renderError = function(errorNumber) {
    this.httpResponse.writeHead(errorNumber);
    this.httpResponse.write("Error " + errorNumber);
    this.httpResponse.end();
  };

  KubrickHttpResponse.prototype.renderStatic = function(filePath) {
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
      _this.httpResponse.end();
    });
  };

  return KubrickHttpResponse;

})();

module.exports = KubrickHttpResponse;

(function() {
  (function($) {
    $(document).ready(function() {
      var socket;
      socket = io();
      socket.emit("data.find", {
        model: "users",
        conditions: {
          nombre: "admin"
        }
      });
      socket.on("data.findResponse", function(user) {
        console.log(user);
      });
    });
  })(jQuery);

}).call(this);

(function($) {
  return $(document).ready(function() {
    var socket;
    socket = io();
    socket.on("connected", function(message) {});
  });
})(jQuery);

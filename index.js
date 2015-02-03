var Kubrick, configs, kubrick;

Kubrick = require("./lib/Kubrick");


/* Start Application */

configs = {
  port: 3000,
  publicFolder: "public"
};

kubrick = new Kubrick(configs);

kubrick.run(function() {
  console.log("Server is Running");
});

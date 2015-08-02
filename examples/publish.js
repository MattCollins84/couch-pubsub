var CouchPubSub = require('couch-pubsub');

var pubsub = new CouchPubSub({
  couch_host: "https://your-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

setInterval(function() {
  pubsub.publish("test-channel", "publish this", function(err, data) {
    console.log(err, data);
  });
}, 1000);
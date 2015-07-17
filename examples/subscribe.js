var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://your-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

var subscribe = pubsub.subscribe("test-channel");

subscribe.on('update', function (update) {
  console.log("UPDATE: "+update);
});
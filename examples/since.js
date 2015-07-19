var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://your-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

pubsub.since("test-channel", "2015-07-11", function(err, data) {
  console.log(data);
});
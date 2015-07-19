#!/usr/bin/env node
 
var publish = require('../lib/pub.js');
var subscribe = require('../lib/sub.js');
var since_lib = require('../lib/since.js');

var argv = process.argv;

// we need an action
if (!argv[2] || (argv[2] !== "publish" && argv[2] !== "subscribe")) {
  console.log("Invalid action!");
  console.log("Usage:");
  console.log("couch-pubsub publish <channel> <message>");
  console.log("couch-pubsub subscribe <channel>");
  process.exit(1);
}
var action = argv[2];

// we need a channel
if (!argv[3] || argv[3] == "") {
  console.log("Channel required!");
  console.log("Usage:");
  console.log("couch-pubsub publish <channel> <message>");
  process.exit(1);
}
var channel = argv[3];

// if action is publish, we need a message
if (action == "publish" && (!argv[4] || argv[4] == "")) {
  console.log("Message required!");
  console.log("Usage:");
  console.log("couch-pubsub publish <channel> <message>");
  process.exit(1);
}

// if action is subscribe, we may have a 'since'
var since = null;
if (action == "subscribe" && typeof argv[4] === "string" && (argv[4].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) || argv[4].match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/))) {
  since = argv[4];
}

// load opts from ENV
// if (!process.env.COUCH_PUBSUB_HOST) {
//   console.log("COUCH_PUBSUB_HOST environment variable required!");
//   process.exit(1);
// }

var opts = {
  couch_host: "https://mattcollins.cloudant.com",
  couch_username: "mattcollins",
  couch_password: "monkey",
  couch_port: null
};

// publish
if (action == "publish") {

  var toPublish = argv[4];

  publish(opts, channel, toPublish, function CLIpublish(err, data) {
    
    if (err) {
      process.stderr.write(JSON.stringify(err) + "\n");
    }
    else {
      process.stdout.write(JSON.stringify(data) + "\n");
    }

  });

}

// subscribe
if (action == "subscribe") {

  // do we have a since?
  if (typeof since === "string") {

    // get everything since this date
    since_lib(opts, channel, since, function(err, data) {

      if (typeof data === "object") {

        for (var d in data) {

          process.stdout.write(data[d] + "\n");

        }

      }

    })

  }

  var subscription = subscribe(opts, channel);
  
  subscription.on('update', function (update) {
  
    process.stdout.write(update + "\n");
    
  });

}
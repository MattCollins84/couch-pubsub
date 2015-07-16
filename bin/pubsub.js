#!/usr/bin/env node
 
var publish = require('../lib/pub.js');
var subscribe = require('../lib/sub.js');

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

// publish
if (action == "publish") {

  var toPublish = argv[4];

  var opts = {
    couch_host: "https://mattcollins.cloudant.com",
    couch_username: "mattcollins",
    couch_password: "monkey",
    couch_port: null // null for default
  };

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
  
  var opts = {
    couch_host: "https://mattcollins.cloudant.com",
    couch_username: "mattcollins",
    couch_password: "monkey",
    couch_port: null // null for default
  };

  subscribe(opts, channel, function CLISubscribe(c) {

    c.on('update', function (update) {
    
      process.stdout.write(update + "\n");
      
    });

  });

}
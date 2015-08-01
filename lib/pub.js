var async = require('async');
var createView = require('./create.js');

// Publish
module.exports = function(opts, channel, toPublish, callback) {

  // required values provided?
  if (typeof opts !== "object" || typeof opts.couch_host !== "string" || opts.couch_host == "") {
    throw new Error("A CouchDB host must be provided");
  }

  // connect to couch and create the DB if needed
  var PouchDB = require('pouchdb');
  var url     = require('./couchurl.js')(opts)+channel;
  var channel_db = new PouchDB(url);

  // async actions
  var actions = {};

  // create channel if does not exist
  actions.viewExists = function(callback) {

    createView(channel_db, function(err, data) {
      return callback(err, data)
    })

  }

  // publish this thing
  actions.publish = function(callback) {

    // fix objects
    if (typeof toPublish === 'object') {
      toPublish = JSON.stringify(toPublish);
    }

    // fix other stuff
    if (typeof toPublish.toString === "function") {
      toPublish = toPublish.toString();
    }

    var doc = {
      str: toPublish,
      ts: new Date().toJSON().split(".")[0].replace(/[^0-9]/g, '')
    }

    channel_db.post(doc, function(err, data) {
      return callback(err, data);
    });

  }

  // run the actions
  async.series(actions, function(err, results) {

    if (typeof callback === "function") {
      // error adding?
      if (err) {
        return callback(err, null);
      }

      // no error
      return callback(null, results.publish);
    }

    return true;

  });

}
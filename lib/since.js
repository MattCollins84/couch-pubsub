/***************
  Find published items since a particular date
***************/
var async = require('async');
var createView = require('./create.js');
var view_since = require('./view_since.js');

module.exports = function(opts, channel, since, callback) {

  // required values provided?
  if (typeof opts !== "object" || typeof opts.couch_host !== "string" || opts.couch_host == "") {
    throw new Error("A CouchDB host must be provided");
  }

  // make sure the 'since' param is good
  // YYYY-MM-DD HH:MM:SS
  // YYYY-MM-DD
  if (!since.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) && !since.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/)) {
    throw new Error("Invalid date provided");
  }
  
  // connect to couch and create the DB if needed
  var PouchDB = require('pouchdb');
  var url     = require('./couchurl.js')(opts)+channel;
  var channel_db = new PouchDB(url);

  // async actions
  var actions = {};

  // create channel if does not exist
  actions.channelExists = function(callback) {

    createView(channel_db, function(err, data) {
      return callback(err, data)
    })

  }

  // get everything since
  actions.since = function(callback) {

    // query the view
    view_since(channel_db, since, function sinceCallback(err, data) {

      if (err) {
        return callback(err, null);
      }

      return callback(null, data);

    })

  }

  // run our actions
  async.series(actions, function(err, results) {

    // return an error
    if (err) {
      return callback(err);
    }

    // or our events
    return callback(null, results.since)

  });

}
/***************
  Find published items since a particular date
***************/
var async = require('async');
var createChannel = require('./create.js');

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
  
  var url = require('./couchurl.js')(opts);

  // connect to couch
  var nano = require('nano')(url);

  // async actions
  var actions = {};

  // create channel if does not exist
  actions.channelExists = function(callback) {

    createChannel(opts, channel, function(err, data) {
      return callback(err, data)
    })

  }

  // get everything since
  actions.since = function(callback) {

    // select DB
    var channel_db = nano.use(channel);
    
    // query the DB for everything since a date
    var events = [];
    var view_opts = {
      startkey: since.replace(/-/g, ""),
      endkey: new Date().toJSON().split(".")[0].replace(/[^0-9]/g, ''),
      include_docs: true,
      reduce: false
    }

    channel_db.view('ts', 'by_ts', view_opts, function(err, body) {

      // problem?
      if (err) {
        return callback(err, null);
      }

      // do we have something to work with?
      if (typeof body !== "undefined" && typeof body.rows === "object") {
        
        body.rows.forEach(function(doc) {

          if (typeof doc === "object" && typeof doc.doc === "object" && typeof doc.doc.str === "string") {
            events.push(doc.doc.str);
          }

        });

      }

      // return everything since
      return callback(null, events);

    });

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
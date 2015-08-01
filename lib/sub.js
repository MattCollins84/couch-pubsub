var async = require('async');
var createView = require('./create.js');
var view_since = require('./view_since.js');

// Subscribe
module.exports = function(opts, channel) {

  // set up our feed
  var EventEmitter = require('events').EventEmitter;
  var feed = new EventEmitter();

  var since = null;

  // required opts provided?
  if (typeof opts !== "object" || typeof opts.couch_host !== "string" || opts.couch_host == "") {
    throw new Error("A CouchDB host must be provided");
  }

  // required channel provided?
  if (typeof channel !== "object" && typeof channel !== "string") {
    throw new Error("A channel must be provided.");
  }

  // is channel an object? parse it
  if (typeof channel === "object") {

    // store a since if there is one
    if (typeof channel.since === "string" && (channel.since.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/) || channel.since.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}$/))) {
      since = channel.since;
    }

    // No channel, error
    if (typeof channel.channel !== "string") {
      throw new Error("A channel must be provided");
    }

    // channel provided, store
    else {
      channel = channel.channel;
    }

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

  // if we have a since, we need to get those events
  if (typeof since === "string") {

    actions.since = function(callback) {

      // query the view
      view_since(channel_db, since, function sinceCallback(err, data) {

        if (!err && typeof data === "object" && data.length) {
          
          // emit each event
          for (var d in data) {
            feed.emit('update', data[d])
          }

        }

        // we don't want to act on this in any way
        return callback(null, null)

      })

    }

  }

  // subscribe to channel
  actions.subscribe = function(callback) {

    // follow changes
    var changes = channel_db.changes({
      since: "now",
      include_docs: true,
      live: true
    })

    // for each change, get the info we want
    // and send it to the feed
    .on('change', function(change) {

      // if we have the stuff we expect
      // emit this event
      if (typeof change === 'object' && typeof change.doc === 'object' && typeof change.doc.str !== 'undefined') {
        feed.emit('update', change.doc.str);
      }

    });

    // send our feed back
    return callback(null, null);

  }

  async.series(actions);
  
  return feed;

}
var async = require('async');

// Subscribe
module.exports = function(opts, channel) {

  // set up our feed
  var EventEmitter = require('events').EventEmitter;
  var feed = new EventEmitter();

  // required values provided?
  if (typeof opts !== "object" || typeof opts.couch_host !== "string" || opts.couch_host == "") {
    throw new Error("A CouchDB host must be provided");
  }
  
  var url = require('./couchurl.js')(opts);

  // connect to couch
  var nano = require('nano')(url);

  // async actions
  var actions = {};

  // create channel if does not exist
  actions.channelExists = function(callback) {

    // if DB exists, this will do nothing
    // otherwise it will create
    // so we can do this blindly
    nano.db.create(channel, function channelExists(err, data) {

      return callback(null, null);

    });

  }

  // subscribe to channel
  actions.subscribe = function(callback) {

    // follow changes
    var channel_db = nano.use(channel);
    var changes = channel_db.follow({since: "now", include_docs: true})
    changes.follow();

    // for each change, get the info we want
    // and send it to the feed
    changes.on('change', function(change) {

      // if we have the stuff we expect
      // emit this event
      if (typeof change === 'object' && typeof change.doc === 'object' && typeof change.doc.str !== 'undefined') {
        feed.emit('update', change.doc.str);
      }

    });

    // send our feed back
    return callback(null, feed);

  }

  async.series(actions, function(err, results) {

  });
  
  return feed;

}
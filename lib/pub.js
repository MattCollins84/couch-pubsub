var async = require('async');

// Publish
module.exports = function(opts, channel, toPublish, callback) {

  // our couch DB url
  var url = opts.couch_host.replace("//","//"+opts.couch_username+":"+opts.couch_password+"@");
  
  // non-default port?
  if (opts.couch_port) {
    url += ":"+opts.couch_port;
  }

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

  // TODO: create design doc


  // publish this thing
  actions.publish = function(callback) {

    // fix objects
    if (typeof toPublish === 'object') {
      toPublish = json.stringify(toPublish);
    }

    // fix other stuff
    if (typeof toPublish.toString === "function") {
      toPublish = toPublish.toString();
    }

    var doc = {
      str: toPublish,
      ts: new Date().toJSON()
    }

    var channel_db = nano.use(channel);
    channel_db.insert(doc, function(err, data) {
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

    return;

  });

}
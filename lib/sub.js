var async = require('async');

// Subscribe
module.exports = function(opts, channel) {

  // our couch DB url
  var url = opts.couch_host.replace("//","//"+opts.couch_username+":"+opts.couch_password+"@");
  
  // non-default port?
  if (opts.couch_port) {
    url += ":"+opts.couch_port;
  }

  // connect to couch
  var nano = require('nano')(url);
  var channel = nano.use(channel);

  // set up our feed
  var EventEmitter = require('events').EventEmitter;
  this.feed = new EventEmitter();

  // follow changes
  var changes = channel.follow({since: "now", include_docs: true})
  changes.follow();

  // for each change, get the info we want
  // and send it to the feed
  changes.on('change', function(change) {

    // if we have the stuff we expect
    // emit this event
    if (typeof change === 'object' && typeof change.doc === 'object' && typeof change.doc.str !== 'undefined') {

      var str = change.doc.str;
      this.feed.emit('update', str);

    }

  }.bind(this));

}
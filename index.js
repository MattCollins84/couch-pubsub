/*****
  Setup our PubSub object
*****/

var publish = require('./lib/pub.js');
var subscribe = require('./lib/sub.js');
var since_lib = require('./lib/since.js');

module.exports = function(opts) {

  // store our opts
  this.opts = opts;

  // Publish
  this.publish = function(channel, toPublish, callback) {
    publish(this.opts, channel, toPublish, callback);
  }.bind(this);

  // Subscribe
  this.subscribe = function(channel) {
    return subscribe(this.opts, channel);
  }.bind(this);

  // since
  this.since = function(channel, since, callback) {
    since_lib(this.opts, channel, since, callback);
  }.bind(this);

}
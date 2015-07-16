/*****
  Setup our PubSub object
*****/

var publish = require('./lib/pub.js');
var subscribe = require('./lib/sub.js');

module.exports = function(opts) {

  // store our opts
  this.opts = opts;

  // Publish
  this.publish = function(channel, toPublish, callback) {
    publish(this.opts, channel, toPublish, callback);
  }.bind(this);

  // Subscribe
  this.subscribe = function(channel, callback) {
    subscribe(this.opts, channel, callback);
  }.bind(this);

}
/*****
  Setup our PubSub object
*****/

var publish = require('./lib/pub.js');

module.exports = function(opts) {

  // Publish
  this.publish = new Publish(opts);

  // Subscribe
  this.subscripe = new Subscribe(opts);

}
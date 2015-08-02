// is this in the browser?
if (process.browser) {
  window.CouchPubSub = require('./lib/main.js');
}

// or in node?
else {
  module.exports = require('./lib/main.js');
}
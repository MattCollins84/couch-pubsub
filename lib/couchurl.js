var url = require('url');

module.exports = function(opts) {
  var urlObj = url.parse(opts.couch_host);
  if (opts.couch_username && opts.couch_password) {
    urlObj.auth = opts.couch_username+":"+opts.couch_password;
  }
  if (opts.couch_port) {
    urlObj.port = opts.couch_port;
  }
  urlObj.host = false;
  return url.format(urlObj)
}
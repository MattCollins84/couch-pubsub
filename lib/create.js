/*****************
  Create a new DB and the necessary views
*****************/


module.exports = function(opts, channel, callback) {

  var nano = require('nano')(require('./couchurl.js')(opts));

  // if DB exists, this will do nothing
  // otherwise it will create
  // so we can do this blindly
  nano.db.create(channel, function channelExists(err, data) {

    // err usually means that this DB exists already
    // regardless, if we've error'd... do nothing
    if (err) {
      return callback(null, null);
    }

    // no error means this is a new DB
    // so we need to add the view for 'since' operations
    var channel_db = nano.use(channel);
    channel_db.insert(require('./by_ts.json'), function viewInsert(ts_err, ts_data) {
      return callback(ts_err, null);
    });

  });

}
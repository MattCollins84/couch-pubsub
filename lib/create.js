/*****************
  Create the necessary views
*****************/


module.exports = function(channel_db, callback) {

  // need to determine if we need to add a view
  channel_db.get("_design/ts", function(err, doc) {

    // do we have an error?
    // is the doc missing?
    if (err && typeof err == "object" && err.message === "missing") {

      // create the view
      channel_db.put(require('./by_ts.json'), function(ts_err, ts_data) {
        return callback(ts_err, ts_data);
      });

    }

    // do we have a different error?
    // uh-oh
    else if (err) {
      return callback(err, null);
    }

    // no error? awesome.
    else {
      return callback(null, null);
    }

  });

}
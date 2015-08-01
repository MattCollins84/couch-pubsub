/*******
  Helper function for querying the since view
********/

module.exports = function(channel_db, since, callback) {
  
  // query the DB for everything since a date
  var events = [];
  var view_opts = {
    startkey: since.replace(/[^0-9]/g, ""),
    endkey: new Date().toJSON().split(".")[0].replace(/[^0-9]/g, ''),
    include_docs: true,
    reduce: false
  }

  channel_db.query('ts/by_ts', view_opts, function(err, body) {

    // problem?
    if (err) {
      return callback(err, null);
    }

    // do we have something to work with?
    if (typeof body !== "undefined" && typeof body.rows === "object") {
      
      body.rows.forEach(function(doc) {

        if (typeof doc === "object" && typeof doc.doc === "object" && typeof doc.doc.str === "string") {
          events.push(doc.doc.str);
        }

      });

    }

    // return everything since
    return callback(null, events);

  });

}
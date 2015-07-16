# couch-pubsub
A pub/sub tool that leverages the power of CouchDB clustering to provide a simple, reliable and distributed system out of the box.

Available on the command line or via the usual Node `require` method.

# Installation 
`couch-pubsub` can be used via the command line or within your Node.js app, it is available on NPM:

```
# via require
npm install couch-pubsub

# via CLI
npm install -g couch-pubsub
```

# Usage
You can subscribe or publish to a particular channel.

## Node
To publish to the `test-channel`, you could do something like this:
``` js
var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://my-couch-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

pubsub.publish("test-channel", "string that you want to publish", function(err, data) {
  
  // err - error writing to couchDB
  // data - the response from couchDB, contains _id and _rev of the doc
  
});
```

If you wanted to listen for updates to this channel you could do something like this:
``` js
var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://my-couch-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

var subscribe = pubsub.subscribe("test-channel", function subscribeChannel(channel) {

  channel.on('update', function (update) {
    
    // update - the value that was published (e.g. 'string that you want to publish' from above')
    
  });

});
```

## Command line
To replicate the examples above on the command line you could do:

```
# publish
couch-pubsub publish test-channel "string that you want to publish"
-> {"ok":true,"id":"7d6eaf1ddcd0f8f42f98d4a58ba3a527","rev":"1-9d78b84800709cf0d8446f2147c74d75"}

# subscribe
couch-pubsub subscribe test-channel
-> "string that you want to publish"
-> "the next string that was published"
-> "the last string to be published"
```

You will need to supply your CouchDB credentials via environemnt variables:
```
export COUCH_PUBSUB_HOSTNAME="http://my-couch-db.com"
export COUCH_PUBSUB_USERNAME="username"
export COUCH_PUBSUB_PASSWORD="password"
```

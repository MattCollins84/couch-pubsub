# couch-pubsub

A pub/sub tool that leverages the power of CouchDB clustering to provide a simple, reliable and distributed system out of the box.

Available on the command line or via the usual Node `require` method.

At the moment there are no automated tests and I am updating fairly regular, please report any issues!

# Installation 

`couch-pubsub` can be used via the command line or within your Node.js app, it is available on NPM:


# via require

```
npm install couch-pubsub
```

# via CLI

```
npm install -g couch-pubsub
```

# Usage

You can subscribe or publish to a particular channel.

## Node

### .publish( channel, str, [callback] )
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

or if you don't want to handle the callback:

``` js
pubsub.publish("test-channel", "string that you want to publish");
```

### .subscribe( opts )

If you wanted to listen for updates to this channel you could do something like this:

``` js
var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://my-couch-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

var sub = pubsub.subscribe("test-channel");
sub.on('update', function (update) {
    
  // update - the value that was published (e.g. 'string that you want to publish' from above')
    
});
```

To get all updates since a particular date and keep on listening for future updates:

``` js
var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://my-couch-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

var sub = pubsub.subscribe({ channel: "test-channel", since: "2015-01-03 13:26:00"});
sub.on('update', function (update) {
    
  // update - the value that was published (e.g. 'string that you want to publish' from above')
    
});
```
### .since( channel, date, callback )

To get all events since a particular date, as a one of event:

``` js
var PubSub = require('couch-pubsub');

var pubsub = new PubSub({
  couch_host: "https://my-couch-db.com",
  couch_username: "username",
  couch_password: "password",
  couch_port: null // null for default
});

var since = pubsub.since("test-channel", "2015-01-03 13:26:00", function(err, data) {
  
  // err - error retrieving previous events
  // data - array of previous events

});
```

## Command line

To replicate the examples above on the command line you could do:

# publish

``` js
couch-pubsub publish test-channel "string that you want to publish"
-> {"ok":true,"id":"7d6eaf1ddcd0f8f42f98d4a58ba3a527","rev":"1-9d78b84800709cf0d8446f2147c74d75"}
```

# subscribe

``` js
couch-pubsub subscribe test-channel
-> "string that you want to publish"
-> "the next string that was published"
-> "the last string to be published"
```

If you want to subscribe but also retrieve all channel events since a particular date, you can add a date to the above comand.

``` js
couch-pubsub subscribe test-channel "2015-01-03 13:26:00"
-> "previous event 1"
-> "previous event 2"
-> "previous event 3"
-> "previous event 4"
-> "string that you want to publish"
-> "the next string that was published"
-> "the last string to be published"
```

You will need to supply your CouchDB credentials via environemnt variables:

```
export COUCH_PUBSUB_HOST="http://my-couch-db.com"
export COUCH_PUBSUB_USERNAME="username"
export COUCH_PUBSUB_PASSWORD="password"
```

# TODO

I put this together pretty quickly and there are some things I want to add still, such as:

* Better error checking
* Some test coverage
* Probably more...
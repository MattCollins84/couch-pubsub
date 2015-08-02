#!/bin/bash
BASEDIR=$(dirname $0)
cd $BASEDIR
cd ..
browserify index.js -o dist/couch-pubsub.js
browserify index.js -o | uglifyjs > dist/couch-pubsub.min.js
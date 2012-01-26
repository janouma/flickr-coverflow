#!/bin/sh

coffee -j lib/flickr-coverflow.js -c src/js/stringEnhancer.coffee src/js/flickr-coverflow.coffee\
 && cd compiler/\
 && ./minify-flickr-coverflow.sh\
 && cd - 


#!/bin/sh
java -jar compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS --warning_level=QUIET\
 --js=../lib/flickr-coverflow.js\
 2>&1 | tee ../lib/flickr-coverflow.min.js
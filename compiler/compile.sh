#!/bin/sh
java -jar compiler.jar --compilation_level=SIMPLE_OPTIMIZATIONS $* 2>&1 | tee built/all.js
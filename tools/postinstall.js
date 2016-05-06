"use strict"

const binPath = 'test/bin'
let fs = require('fs')

if (__dirname.indexOf('node_modules') < 0 && !fs.existsSync(binPath)) {
  fs.mkdirSync(binPath)
}
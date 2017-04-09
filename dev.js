'use strict'

const fork = require('child_process').fork
const chokidar = require('chokidar')
const del = require('del')

const distDir = 'dist'

del.sync(distDir)
fork('build.js')

const browserSync = require('browser-sync')
browserSync({
  files: distDir,
  ghostMode: false,
  notify: false,
  open: false,
  port: 4444,
  reloadDelay: 500,
  ui: false,
  server: distDir,
})

const watcher = chokidar.watch(['extensions', 'lib', 'src', 'templates', 'build.js'], { ignoreInitial: true })
watcher.on('all', function (a, b) {
  fork('build.js')
})

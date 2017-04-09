'use strict'

const map = require('map-stream')
const browserify = require('browserify')

module.exports = function () {

  return map((file, next) => {
    browserify(file.path).bundle((err, bundle) => {
      if (err) {
        return next(err)
      }
      file.contents = bundle
      next(null, file)
    })
  })
}

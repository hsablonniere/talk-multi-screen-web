'use strict'

const resolve = require('path').resolve

const del = require('del')
const vfs = require('vinyl-fs')
const map = require('map-stream')

const source = resolve(__dirname, 'src')
const destination = resolve(__dirname, 'dist')
const extdir = resolve(__dirname, 'extensions')

const asciidoctorBespoke = require('./lib/gulp-asciidoctor-bespoke')
const browserify = require('./lib/gulp-browserify')
const postcss = require('gulp-postcss')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const log = function () {
  return map((file, next) => {
    console.log(file.path)
    next(null, file)
  })
}

vfs.src('index.adoc', { cwd: source, base: source })
  .pipe(asciidoctorBespoke({ templatedir: 'templates', extdir }))
  .pipe(vfs.dest(destination, { cwd: destination, base: destination }))

vfs.src('main.js', { cwd: source, base: source })
  .pipe(browserify())
  .pipe(vfs.dest(destination, { cwd: destination, base: destination }))

vfs.src('styles/main.css', { cwd: source, base: source })
  .pipe(postcss([
    postcssImport(),
    autoprefixer({ browsers: ['last 2 version'] }),
    cssnano(),
  ]))
  .pipe(vfs.dest(destination, { cwd: destination, base: destination }))

vfs.src(['images/**/*.*', 'fonts/**/*.*'], { cwd: source, base: source })
  .pipe(vfs.symlink(destination, { cwd: destination, base: destination }))

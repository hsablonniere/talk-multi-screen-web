'use strict'

const spawn = require('child_process').spawn

const map = require('map-stream')

function streamToBuffer(stream) {

  const stdoutChunks = []
  let stdoutLength = 0

  return new Promise((resolve, reject) => {

    stream.on('data', (chunk) => {
      stdoutChunks.push(chunk)
      stdoutLength += chunk.length
    })
    stream.on('end', () => {
      resolve(Buffer.concat(stdoutChunks, stdoutLength))
    })
    stream.on('error', reject)
  })
}

module.exports = function ({ templatedir, extdir }) {

  return map((file, next) => {

    const opts = [
      'exec',
      'asciidoctor-bespoke',
      '-r',
      `${extdir}/slides-treeprocessor.rb`,
      '-T',
      templatedir,
      '-',
    ]

    const { stdin, stdout, stderr } = spawn('bundle', opts)
    stdin.write(file.contents)
    stdin.end()

    return Promise
      .all([streamToBuffer(stderr), streamToBuffer(stdout)])
      .then(([stderr, stdout]) => {

        const warnings = stderr.toString().trim();
        console.log(warnings)

        file.contents = new Buffer(stdout)
        file.extname = '.html'

        next(null, file)
      })
      .catch(next)
  })
}

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

// const keyboard = require('..')

const { Readable, Transform } = require('stream')

function emulate (input, opts) {
  if (typeof input === 'string') { input = input.split('') } else { throw new TypeError(`unsupported input type: ${typeof input}`) }

  opts = {
    fast: 100,
    slow: 300,
    encoding: 'utf8',
    ...opts
  }

  const random = () => Math.floor(
    Math.random() * (opts.slow - opts.fast + 1)
  ) + opts.fast

  console.log('should emulate %s', input)
  return new Readable({
    read () {
      const value = input.length > 0
        ? Buffer.from(input.shift(), opts.encoding)
        : null
      setTimeout(() => { this.push(value) }, random())
    }
  })
}

process.stdin.resume()
console.log('INFO stdin resumed')

const sequence = [
  'escribir unha frase',
  'Intro',
  'Ctrl+D'
]

Promise.resolve()
  .then(() => new Promise((resolve, reject) => {
    emulate(sequence, { encoding: 'ascii' })
      .pipe(new Transform({
        transform (chunk, encoding, callback) {
          console.error('chunk:', chunk)
          console.error('encoding:', encoding)
          callback(null)
        }
      }))
      .on('finish', resolve)
  }))
  .then(() => new Promise((resolve, reject) => {
    emulate(sequence, { encoding: 'utf8' })
      .pipe(new Transform({
        transform (chunk, encoding, callback) {
          console.error('chunk:', chunk)
          console.error('encoding:', encoding)
          callback(null)
        }
      }))
      .on('finish', resolve)
  }))
  .then(() => {
    console.log('everything has end')
    process.stdin.pause()
    console.log('INFO stdin paused')
  })

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

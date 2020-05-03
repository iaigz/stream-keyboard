console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const { PassThrough, Transform } = require('stream')
const Keyboard = require('..')

const keystream = new Keyboard({ t: 1 })

console.log('INFO resumed process.stdin to avoid premature exit')
process.stdin.resume()

const timeout = setTimeout(() => {
  console.log('FAIL keystream should have end already')
  process.exitCode = 124
  process.stdin.pause()
}, 2000)

let emitsTimeout = false
let emitsEnd = false

new PassThrough()
  .pipe(keystream)
  .on('timeout', () => {
    console.log('INFO keystream has emitted "timeout" event')
    emitsTimeout = true
    clearTimeout(timeout)
  })
  .on('end', () => {
    console.log('INFO keystream has emitted "end" event')
    emitsEnd = true
    process.stdin.pause()
  })
  // pipe to something, so it starts flowing
  .pipe(new Transform({
    transform (chunk, enc, cb) {
      console.error('chunk:', chunk)
      console.error('values:', Array.prototype.map.call(chunk, c => c))
      cb(null)
    }
  }))

process.on('beforeExit', code => {
  if (emitsTimeout === true) {
    console.log('PASS timeout event was emitted')
  } else {
    console.log('FAIL timeout event was not emitted')
    if (code === 0) throw new Error('avoid exit 0')
  }
  if (emitsEnd === true) {
    console.log('PASS end event was emitted')
  } else {
    console.log('FAIL end event was not emitted')
    if (code === 0) throw new Error('avoid exit 0')
  }
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

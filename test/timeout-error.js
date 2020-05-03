console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

//
// NOTE: this test must be run with `timeout` command or could hang
//

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

let emitsError = false
let emitsEnd = false

new PassThrough()
  .pipe(keystream)
  .on('error', (err) => {
    console.log('INFO keystream has emitted "error" event')
    if (err.code !== 'KEYBOARD_TIMEOUT') throw err
    emitsError = true
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
  if (emitsError === true) {
    console.log('PASS error event was emitted')
  } else {
    console.log('FAIL error event was not emitted')
    process.exitCode = 1
  }
  if (emitsEnd === true) {
    console.log('PASS end event was emitted')
  } else {
    console.log('FAIL end event was not emitted')
    process.exitCode = 1
  }
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

//
// NOTE: this test must be run with `timeout` command or could hang
//

const { PassThrough, Transform } = require('stream')
const Keyboard = require('..')

const input = new PassThrough()
const keystream = new Keyboard({ t: 1 })

const timeout = setTimeout(() => {
  console.log('FAIL test should have end already')
  process.exitCode = 124
}, 3000)

let emitsTimeout = false
let emitsEnd = false

input
  .pipe(keystream)
  .on('timeout', () => {
    console.log('INFO keystream has emitted "timeout" event')
    emitsTimeout = true
  })
  .on('end', () => {
    console.log('INFO keystream has emitted "end" event')
    emitsEnd = true
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
  if (emitsTimeout === false) {
    console.log('PASS timeout event was not emitted')
  } else {
    console.log('FAIL timeout event was emitted')
    process.exitCode = 1
  }
  if (emitsEnd === false) {
    console.log('PASS end event was not emitted')
  } else {
    console.log('FAIL end event was emitted')
    process.exitCode = 1
  }
})

const init = Date.now()
setTimeout(() => {
  console.log('INFO emulate unpiped input')
  input.unpipe(keystream)
  setTimeout(() => {
    console.log(`INFO ${Date.now() - init} ms have elapsed`)
    clearTimeout(timeout)
  }, 700)
}, 500)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

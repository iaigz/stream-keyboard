console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const { PassThrough } = require('stream')
const Keyboard = require('..')

// number value to customize "sigint" code
const sigint = 4

const stub = new PassThrough()
const keystream = new Keyboard({ sigint: sigint })

let dataCount = 0
let end = false

stub.pipe(keystream)
  .on('data', data => {
    if (data.length === 1) {
      console.log('PASS data buffer length is 1')
    } else {
      console.error('data.length:', data.length)
      console.error('data:', data)
      console.log('FAIL data buffer length incorrect')
      process.exit(1)
    }
    if (data[0] === sigint) {
      console.log('PASS data buffer has expected value')
    } else {
      console.error('actual (data[0]):', data[0])
      console.error('expected:', sigint)
      console.log('FAIL data buffer value is not correct')
      process.exit(1)
    }
    dataCount++
    console.log('INFO keystream should end automatically')
  })
  .on('end', () => {
    console.log('INFO keystream has end')
    end = true
  })

process.on('beforeExit', () => {
  if (dataCount === 1) {
    console.log('PASS Keyboard stream "data" event was emitted 1 time')
  } else {
    console.error('dataCount (times emitted):', dataCount)
    console.log('FAIL "data" should have been emmited 1 time')
    process.exitCode = 1
  }
  if (end === true) {
    console.log('PASS Keyboard stream "end" event was emitted')
  } else {
    console.log('FAIL "end" event should have been emmited')
    process.exitCode = 1
  }
})

stub.write(Buffer.from([sigint]))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const { PassThrough } = require('stream')
const Keyboard = require('..')

const stub = new PassThrough()

// aditionally to the data pass-through, will check sigint: false works
const keystream = new Keyboard({ sigint: false, t: 1 })

const seq = [
  [0],
  [3], // we test also to not end on sigint
  [27, 14],
  [65, 66, 128]
]
let idx = 0
let end = false
let timeout = false

stub.pipe(keystream)
  .on('data', data => {
    if (data.length === seq[idx].length) {
      console.log('PASS data buffer length is correct for seq[%s]', idx)
    } else {
      console.error(`seq[${idx}]:`, seq[idx])
      console.error('data:', data)
      console.log('FAIL data buffer length incorrect for seq[%s]', idx)
      process.exit(1)
    }
    if (seq[idx].every((value, pos) => value === data[pos])) {
      console.log('PASS data buffer has every expected value for seq[%s]', idx)
    } else {
      console.error(`seq[${idx}]:`, seq[idx])
      console.error('data:', data)
      console.log('FAIL data buffer values are incorrect for seq[%s]', idx)
      process.exit(1)
    }
    if (++idx === seq.length) {
      // don't emulate input end; wait for timeout
    } else {
      // don't waste sequence too quickly to avoid false positives
      setTimeout(() => stub.write(Buffer.from(seq[idx])), 500)
    }
  })
  .on('timeout', () => {
    console.log('INFO keystream has timed out')
    timeout = true
  })
  .on('end', () => {
    console.log('INFO keystream has end')
    end = true
  })

process.on('beforeExit', () => {
  if (timeout === true) {
    console.log('PASS Keyboard stream "timeout" event was emitted')
  } else {
    console.log('FAIL "timeout" should have been emmited')
    process.exitCode = 1
  }
  if (end === true) {
    console.log('PASS Keyboard stream "end" event was emitted')
  } else {
    console.log('FAIL "end" should have been emmited')
    process.exitCode = 1
  }
  if (idx === seq.length) {
    console.log('PASS Keyboard stream "data" event was emitted %s times', idx)
  } else {
    console.error('idx (times emitted):', idx)
    console.log('FAIL "data" should have been emmited %s times', seq.length)
    process.exitCode = 1
  }
})

stub.write(Buffer.from(seq[idx]))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

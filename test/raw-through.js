console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const { PassThrough } = require('stream')
const Keyboard = require('..')

const stub = new PassThrough()
const keystream = new Keyboard()

const seq = [
  [0],
  [27, 14],
  [65, 66, 128]
]
let idx = 0
let end = false

stub.pipe(keystream)
  .on('data', data => {
    if (data.length === seq[idx].length) { console.log('PASS data buffer length is correct for seq[%s]', idx) } else {
      console.error(`seq[${idx}]:`, seq[idx])
      console.error('data:', data)
      console.log('FAIL data buffer length incorrect for seq[%s]', idx)
      process.exit(1)
    }
    if (seq[idx].every((value, pos) => value === data[pos])) { console.log('PASS data buffer has every expected value for seq[%s]', idx) } else {
      console.error(`seq[${idx}]:`, seq[idx])
      console.error('data:', data)
      console.log('FAIL data buffer values are incorrect for seq[%s]', idx)
      process.exit(1)
    }
    if (++idx === seq.length) { stub.end() } else { stub.write(Buffer.from(seq[idx])) }
  })
  .on('end', () => {
    console.log('INFO keystream has end')
    end = true
  })

process.on('beforeExit', () => {
  if (idx === seq.length) { console.log('PASS Keyboard stream "data" event was emitted %s times', idx) } else {
    console.error('idx (times emitted):', idx)
    console.log('FAIL "data" should have been emmited %s times', seq.length)
    process.exitCode = 1
  }
  if (end === true) { console.log('PASS Keyboard stream "end" event was emitted') } else {
    console.log('FAIL "end" should have been emmited')
    process.exitCode = 1
  }
})

stub.write(Buffer.from(seq[idx]))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

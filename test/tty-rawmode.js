console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const { PassThrough } = require('stream')
const Keyboard = require('..')

// let's mock a TTY ReadStream https://nodejs.org/api/tty.html
const mock = new PassThrough()
mock.isTTY = true
mock.isRaw = false
mock.setRawMode = function (mode) {
  this.isRaw = !!mode
}

const keystream = new Keyboard()

const seq = [
  [0],
  [27, 14],
  [65, 66, 128],
  [3] // will emulate Ctrl+C at the end
]
let idx = 0
let end = false

mock.pipe(keystream)
  .on('data', data => {
    if (mock.isRaw === true) {
      console.log('PASS tty mock was set to "raw" mode')
    } else {
      console.log('mock.isRaw:', mock.isRaw)
      console.log('FAIL tty mock should have been set to "raw" mode')
      process.exit(1)
    }
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
      console.log('INFO keystream should end automatically')
    } else {
      mock.write(Buffer.from(seq[idx]))
    }
  })
  .on('end', () => {
    console.log('INFO keystream has end')
    end = true
    if (mock.isRaw === false) {
      console.log('PASS tty mock "raw" mode was disabled before "end"')
    } else {
      console.log('mock.isRaw:', mock.isRaw)
      console.log('FAIL "raw" mode should have been disabled before "end"')
      process.exit(1)
    }
  })

process.on('beforeExit', () => {
  if (idx === seq.length) {
    console.log('PASS Keyboard stream "data" event was emitted %s times', idx)
  } else {
    console.error('idx (times emitted):', idx)
    console.log('FAIL "data" should have been emmited %s times', seq.length)
    process.exitCode = 1
  }
  if (end === true) {
    console.log('PASS Keyboard stream "end" event was emitted')
  } else {
    console.log('FAIL "end" event should have been emmited')
    process.exitCode = 1
  }
  if (mock.isRaw === false) {
    console.log('PASS tty.ReadStream mock is not "raw" before exit')
  } else {
    console.error('mock.isRaw:', mock.isRaw)
    console.log('FAIL tty.ReadStream mock should not be "raw" before exit')
    process.exitCode = 1
  }
})

mock.write(Buffer.from(seq[idx]))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

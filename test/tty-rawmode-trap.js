console.log('TEST node', __filename)

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
  [0] // emulate just 1 data event
]
const idx = 0

mock.pipe(keystream)
  .on('data', data => {
    // emulate a premature process' exit
    process.exit()
  })

process.on('exit', (code) => {
  if (mock.isRaw === false) {
    console.log('PASS tty.ReadStream mock is not "raw" before exit')
    console.log('CODE', code)
  } else {
    console.error('mock.isRaw:', mock.isRaw)
    console.log('FAIL tty.ReadStream mock should not be "raw" before exit')
    console.log('CODE', code)
    // did not find a way to properly alter process.exitCode here
    throw new Error('failed test')
  }
})

mock.write(Buffer.from(seq[idx]))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

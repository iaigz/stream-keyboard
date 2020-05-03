console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

let Keyboard = null

try {
  Keyboard = require('..')
  console.log('PASS module can be required without errors')
} catch (err) {
  console.error(err.stack)
  console.log('FAIL module should be able to be required without errors')
  process.exit(1)
}

if (typeof Keyboard !== 'function') {
  console.error('typeof:', typeof Keyboard)
  console.error('exports:', Keyboard)
  console.log('FAIL module should export a function')
  process.exit(1)
} else {
  console.log('PASS module exports a function')
}

const { Readable, Writable, PassThrough } = require('stream')
let keystream = null

// arguments for successful instance creation
const correct = [
  [], // no arguments at all
  [new PassThrough()] // any readable to specify only opts.input
]
correct.forEach(value => {
  try {
    keystream = Keyboard(...value)
    throw new Error('should fail')
  } catch (err) {
    if (err.message === 'should fail') {
      console.error('arguments:', value)
      console.log('FAIL instance creation should fail without new keyword')
      process.exit(1)
    }
    console.log('PASS instance creation fails without new keyword')
  }
})

correct.forEach((value, idx) => {
  try {
    keystream = new Keyboard(...value)
    console.log('PASS instance can be created (case %s)', idx)
  } catch (err) {
    console.error(err)
    console.error('arguments:', value)
    console.log('FAIL instance should have been created succesfully')
    process.exit(1)
  }
  if (keystream instanceof Readable) {
    console.log('Pass instance inherits Readable stream')
  } else {
    console.error('arguments:', value)
    console.log('FAIL instance should inherit from Readable stream')
    process.exit(1)
  }
  if (keystream instanceof Writable) {
    console.log('Pass instance inherits Writable stream')
  } else {
    console.error('arguments:', value)
    console.log('FAIL instance should inherit from Writable stream')
    process.exit(1)
  }
  if (keystream instanceof Keyboard) {
    console.log('Pass instance is instanceof exported function')
  } else {
    console.error('arguments:', value)
    console.log('FAIL instance should inherit from exported function')
    process.exit(1)
  }
})

// arguments which should throw at instance creation
const incorrect = [
]
incorrect.forEach((value, idx) => {
  try {
    keystream = new Keyboard(...value)
    throw new Error('should fail')
  } catch (err) {
    if (err.message === 'should fail') {
      console.error('arguments:', value)
      console.log('FAIL instance creation should fail with this arguments')
      process.exit(1)
    }
    console.log('PASS instance creation fails (case %s)', idx)
  }
})

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

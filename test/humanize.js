console.log('TEST node', __filename)

process.on('exit', code => { console.log('CODE', code) })

const Keyboard = require('..')

const keystream = new Keyboard({ humanize: true, sigint: false })

const cases = require('./_case-groups.js')
const groups = Object.keys(cases)

function debug (chunk, code, string) {
  console.error('')
  console.error('code (which generates keystroke):', code)
  console.error('code.length:', code.length)
  console.error('')
  console.error('chunk (actual value):', chunk)
  // convert through %j to avoid writing raw control sequences
  console.error('stringifyed chunk: %j', chunk.toString())
  console.error('stringifyed chunk length:', chunk.toString().length)
  console.error('')
  console.error('string (expected value):', string)
  console.error('string.length:', string.length)
  console.error('')
}

function testGroup (next) {
  const key = groups.shift()
  const group = cases[key]
  console.log('DESC key as', key)
  let promise = Promise.resolve()
  group.forEach((value, idx) => {
    promise = promise.then(() => new Promise((resolve, reject) => {
      console.log(`DESC case as ${key}[${idx}]`)
      const [code, string] = [...value]
      keystream.once('data', (chunk) => {
        const actual = chunk.toString()
        if (actual.length !== string.length || actual !== string) {
          debug(chunk, code, string)
          return reject(new Error('chunk.toString() is not correct'))
        }
        console.log(`PASS ${key}[${idx}] string value is correct`)
        resolve()
      })
      keystream.write(Buffer.from(code))
    }))
  })
  promise.then(() => {
    console.log(`PASS all '${key}' group cases succeed`)
    return next()
  }).catch(err => {
    console.log(`FAIL all '${key}' group cases should succeed`)
    next(err)
  })
}

Promise.resolve()
  .then(() => new Promise((resolve, reject) => {
    testGroup(function next (err) {
      if (err) return reject(err)
      if (groups.length) {
        testGroup(next)
      } else {
        console.log('INFO no more groups to test')
        resolve()
      }
    })
  }))
  .catch(err => {
    console.error(err.stack)
    console.log('FAIL a test case failed down the promise chain')
    process.exitCode = 1
  })

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

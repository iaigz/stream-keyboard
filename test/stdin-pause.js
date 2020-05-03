
//
// NOTE: this test must be run with `timeout` command or could hang
//

const { Transform } = require('stream')
const Keyboard = require('..')
const keystream = new Keyboard({ sigint: false })

process.stdin
  .on('end', () => {
    console.log('stdin has end')
  })
  .pipe(keystream)
  .on('end', () => {
    console.log('INFO keyboard has end, process should exit gracefully')
  })
  // just consume the data throwing it away
  .pipe(new Transform({
    transform (chunk, enc, cb) {
      console.error('chunk:', chunk)
      console.error('values:', Array.prototype.map.call(chunk, c => c))
      cb(null)
    }
  }))
  // imagine after-processing
  .pipe(process.stdout)

setTimeout(() => {
  console.log('INFO will emulate keystream end')
  keystream.end()
}, 100)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

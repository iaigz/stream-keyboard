const { Transform } = require('stream')

const Log = require('@iaigz/core-log')
const log = new Log()

const Keyboard = require('..')

log.level = log.VERB

log.info('demo should close gracefully after pressing lowercase "c"')

process.stdin
  .pipe(new Keyboard({ sigint: 0x63 }))
  .on('end', () => {
    log.info('keyboard has end, process should exit gracefully')
  })
  // amazing way to push an extra newline character after each humanized key
  .pipe(new Transform({
    transform (chunk, enc, cb) {
      console.error('chunk:', chunk)
      console.error('values:', Array.prototype.map.call(chunk, c => c))
      cb(null)
    }
  }))
  // pipe tranformed data to stdout
  .pipe(process.stdout)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

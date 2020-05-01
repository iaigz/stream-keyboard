const { Transform } = require('stream')
const abc = require('iai-api')
const log = abc.log
const readkeys = abc.readkeys

log.level = log.VERB

var keyboard = readkeys({ t: 5, humanize: true })

process.stdin
  .pipe(keyboard)
  .on('timeout', () => {
    log.info('keyboard timed out')
  })
  .on('end', () => {
    log.info('keyboard has end, process should exit gracefully')
  })
  // amazing way to push an extra newline character
  .pipe(new Transform({
    transform: (chunk, enc, cb) => cb(null, chunk.toString('utf8') + '\n')
  }))
  .pipe(process.stdout)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

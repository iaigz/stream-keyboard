const { Transform } = require('stream')

const Log = require('@iaigz/core-log')
const log = new Log()

const readkeys = require('..')

log.level = log.VERB

const keyboard = readkeys({ t: 5, humanize: true })

log.info('demo should close gracefully after 5 seconds without pressing a key')

process.stdin
  .pipe(keyboard)
  .on('timeout', () => {
    log.info('keyboard timed out')
  })
  .on('end', () => {
    log.info('keyboard has end, process should exit gracefully')
  })
  // amazing way to push an extra newline character after each humanized key
  .pipe(new Transform({
    transform: (chunk, enc, cb) => cb(null, chunk.toString('utf8') + '\n')
  }))
  // echo the humanized keys to stdout
  .pipe(process.stdout)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

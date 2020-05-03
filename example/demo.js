const { Transform } = require('stream')

const Log = require('@iaigz/core-log')
const log = new Log()

const Keyboard = require('..')

log.level = log.VERB

log.info('demo will close gracefully after 5 seconds without pressing a key')

process.stdin
  .pipe(new Keyboard({ t: 5, humanize: true }))
  .on('timeout', () => {
    log.warn('keyboard stream timed out! (no keypress within 5 seconds)')
  })
  .on('end', () => {
    log.info('keyboard stream has end, process should exit gracefully')
  })
  // amazing way to push an extra newline character after each humanized key
  .pipe(new Transform({
    transform (chunk, enc, cb) {
      this.push(`pressed key is '${chunk.toString('utf8')}'\n`)
      log.info('> tip: use Ctrl+C to exit demo')
      cb(null)
    }
  }))
  // echo the humanized keys to stdout
  .pipe(process.stdout)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

const Log = require('@iaigz/core-log')
const log = new Log()

const readkeys = require('..')

log.level = log.VERB

log.warn('This demo will never end until received Ctrl+C')
process.stdin
  .pipe(readkeys({ humanize: true }))
  .on('data', (data) => log.echo('data: "%s"', data))
  .on('end', () => log.echo('end, should gracefully close'))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

const abc = require('iai-api')
const log = abc.log
const readkeys = abc.readkeys

log.level = log.VERB

log.warn('This test will never end until received Ctrl+C')
process.stdin
  .pipe(readkeys({ humanize: true }))
  .on('data', (data) => log.echo('data: "%s"', data))
  .on('end', () => log.echo('end, should gracefully close'))

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

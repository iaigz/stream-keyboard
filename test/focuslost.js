const abc = require('iai-api')
const log = abc.log
const readkeys = abc.readkeys

log.level = log.VERB

process.stdin
  .pipe(readkeys({ humanize: true }))
  .on('data', (data) => log.echo('data: "%s"', data))
  .once('focuslost', function first () { // once!!
    process.stdin.unpipe(this)
    log.warn('first lost focus, unpiped stdin, resuming in 5s')
    this.once('focuslost', () => {
      process.stdin.pause()
      log.warn('second focus lost, paused stdin, should exit normally')
    })
    setTimeout(() => log.info('pipe again') + process.stdin.pipe(this), 5000)
  })
  .on('end', () => {
    log.error('this event should never emit on this example')
  })

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

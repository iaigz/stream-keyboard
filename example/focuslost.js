const Log = require('@iaigz/core-log')
const log = new Log()

log.level = log.VERB

const readkeys = require('..')

log.info('this demonstrates "focuslost" event. Use Ctrl+C to trigger it')

log.warn('TODO: Proba "Inicio" e "Fin"!!! non vai guay')

process.stdin
  .pipe(readkeys({ humanize: true }))
  .on('data', (data) => log.echo('data: "%s"', data))
  .once('focuslost', function first () {
    // once!! (or will run again and again)
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

const path = require('path').posix

const Log = require('@iaigz/core-log')
const log = new Log()

log.level = log.VERB

const readkeys = require('..')

let Job = null
try {
  Job = require('@iaigz/tool-job')
} catch (err) {
  log.error('This example requires @iaigz/tool-job')
  throw err
}

// will not humanize here to fake input for Job
const keyboard = readkeys({ t: 5 })

const job = new Job('node', [path.resolve(__dirname, 'demo.js')], {
  stdio: 'pipe',
  stdin: process.stdin.pipe(keyboard)
    .on('timeout', () => {
      log.info('keyboard timed out, should gracefully close now')
    })
})

job.start()

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

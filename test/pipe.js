const abc = require('iai-api')
// TODO WTF this path here
const Job = require('../../../../app/Job')
const log = abc.log
const readkeys = abc.readkeys

log.level = log.VERB

// will not humanize here to fake input for Job
var keyboard = readkeys({ t: 5 })

Job('node', [abc.path.to('../../test/lib/iai-api/keyboard', 'basic.js')], {
  stdio: 'pipe',
  stdin: process.stdin.pipe(keyboard)
    .on('timeout', () => {
      log.info('keyboard timed out, should gracefully close now')
    })
}).start()
/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

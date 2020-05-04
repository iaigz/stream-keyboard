
const Log = require('@iaigz/core-log')
const log = new Log()

const abcdary = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ctrlAbc = abcdary + '34567'

//
// this strategy is designed to handle arrays aswell
module.exports = function keystroke (buffer) {
  const length = buffer.length
  const values = Array.prototype.map.call(buffer, v => v)
  if (length === 1) {
    const code = values[0]
    switch (code) {
      case 0: return 'Ctrl+Space'
      case 9: return 'Tab'
      case 13: return 'Enter'
      case 27: return 'Escape'
      case 32: return 'Space'
      case 127: return 'Backspace'
    }
    if (code < 33) return 'Ctrl+' + ctrlAbc[code]
    return String.fromCharCode(code)
  }
  if (length === 2 && values[0] === 27) {
    const code = values[1]
    const name = keystroke([code])
    return (name.split('+').length > 1)
      ? name.replace(/^Ctrl\+/, 'Ctrl+Alt+')
      : `Alt+${name}`
  }
  if (length === 2 || length === 3) {
    return Buffer.from(values).toString('utf8')
  }
  log.warn('unknown keystroke code:', values)
  return JSON.stringify(values)
}

//
// TODO Special keys
//
/*
  '\u001b[2~': 'Insert', // [27,91,50,126] - Insert key
  '\u001b[3~': 'Delete', // [27,91,51,126] - Delete key
  '\u001b[5~': 'RePag', // [27,91,52,126] - Page up
  '\u001b[6~': 'AvPag', // [27,91,53,126] - Page down

  '\u001b[A': 'ArrowUp', // [27,91,65]
  '\u001b[B': 'ArrowDown', // [27,91,66]
  '\u001b[C': 'ArrowRight', // [27,91,67]
  '\u001b[D': 'ArrowLeft' // [27,91,68]
*/

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */


const Log = require('@iaigz/core-log')
const log = new Log()

const abcdary = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ctrlAbc = abcdary + '34567'

const unknown = (values) => {
  log.warn('unknown keystroke code:', values)
  return JSON.stringify(values)
}

//
// this strategy is designed to handle arrays aswell
module.exports = function keystroke (buffer) {
  const length = buffer.length
  const values = Array.prototype.map.call(buffer, v => v)
  // try to be specific, so unknown keystroke codes are reported
  // add test cases to add known codes
  // length-based seems quick and better to avoid long if chains
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
  if (
    (length === 2 && values[0] >= 194 && values[0] <= 201) ||
    (length === 3 && values[0] === 226)
  ) {
    return Buffer.from(values).toString('utf8')
  }

  if (values[0] !== 27) {
    /* switch (length) {
      case 2:
      case 3:
    } */
    return unknown(values)
  }

  // from here onwards, we have a escape sequence
  let keycode, keyname
  switch (length) {
    case 2:
      // "alt" control sequences
      keyname = keystroke([values[1]])
      return (keyname.split('+').length > 1)
        ? keyname.replace(/^Ctrl\+/, 'Ctrl+Alt+')
        : `Alt+${keyname}`
    case 3:
      // function keys (1 to 4)
      if (values[1] !== 79) { break }
      if (values[2] < 80 || values[2] > 83) { break }
      return `F${values[2] - 79}`
    case 5:
      // function keys (5 to 12)
      if (values[4] !== 126) { break }
      if (values[1] !== 91) { break }
      if (values[2] === 49) {
        if (values[3] < 53 || values[3] > 57) { break }
        if (values[3] === 54) { break } // strange "F5,5" case
        const x = values[3] === 53 ? 48 : 49
        return `F${values[3] - x}`
      }
      if (values[2] !== 50) { break }
      if (values[3] < 48 || values[3] > 51) { break }
      return `F${values[3] - 39}`
    case 6:
      // alt function keys (1 to 4)
      if (values[1] !== 91) { break }
      if (values[2] !== 49) { break }
      if (values[3] !== 59) { break }
      if (values[4] !== 51 && values[4] !== 53) { break }
      if (values[5] < 80 || values[5] > 83) { break }
      return (values[4] === 51 ? 'Alt' : 'Ctrl') + `+F${values[5] - 79}`
      // alternative: keystroke([27, 79, values[length - 1]])
    case 7:
      // alt function keys (5 to 12)
      if (values[6] !== 126) { break }
      if (values[1] !== 91) { break }
      if (values[4] !== 59) { break }
      if (values[5] !== 51 && values[5] !== 53) { break }
      keycode = [27, 91].concat(values.slice(2, 4)).concat(126)
      keyname = keystroke(keycode)
      if (keyname.length[0] === '"') { return keyname } // "unknown" was called
      return (values[5] === 51 ? 'Alt' : 'Ctrl') + `+${keyname}`
  }

  // default action , treat as unknown
  log.warn('unknown escape sequence', buffer)
  return unknown(values)
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

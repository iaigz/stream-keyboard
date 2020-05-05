
const Log = require('@iaigz/core-log')
const log = new Log()

const abcdary = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ctrlAbc = abcdary + '34567'
const arrows = ['Up', 'Down', 'Right', 'Left']
const special = ['Home', 'Insert', 'Delete', 'End', 'PageUp', 'PageDown']

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
  // from here onwards we deal with a multi-byte keystroke

  if (values[0] !== 27) {
    let printable = false
    switch (length) {
      case 2: printable = (values[0] >= 194 && values[0] <= 201); break
      case 3: printable = (values[0] === 226); break
    }
    return printable
      ? Buffer.from(values).toString('utf8')
      : unknown(values)
  }

  // from here onwards, we have a escape sequence
  let keycode, keyname, modkey
  switch (length) {
    case 2:
      // "alt" control sequences
      keyname = keystroke([values[1]])
      return (keyname.split('+').length > 1)
        ? keyname.replace(/^Ctrl\+/, 'Ctrl+Alt+')
        : `Alt+${keyname}`
    case 3:
      if (values[1] === 91) {
        if (values[2] < 65) { break }
        // arrow keys
        if (values[2] < 69) { return `Arrow${arrows[values[2] - 65]}` }
        // xterm mode HOME and END keys
        if (values[2] === 70) { return special[3] }
        if (values[2] === 72) { return special[0] }
        break
      }
      // function keys (1 to 4)
      if (values[1] === 79) {
        if (values[2] < 80 || values[2] > 83) { break }
        return `F${values[2] - 79}`
      }
      break
    case 4:
      if (values[1] !== 91) { break }
      // text-only-mode function keys (1 to 5)
      if (values[2] === 91) {
        if (values[3] < 65 || values[3] > 69) { break }
        return `F${values[3] - 64}`
      }
      // text-only-mode special "six" keys
      if (values[3] === 126) {
        if (values[2] < 49 || values[2] > 54) { break }
        return special[values[2] - 49]
      }
      break
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
      if (values[2] === 50) {
        if (values[3] < 48 || values[3] > 52) { break }
        if (values[3] === 50) { break } // strange "F10,5" case
        const x = values[3] < 50 ? 39 : 40
        return `F${values[3] - x}`
      }
      break
    case 6:
      if (values[1] !== 91) { break }
      if (values[2] !== 49) { break }
      if (values[3] !== 59) { break }
      if (values[4] !== 51 && values[4] !== 53 && values[4] !== 55) { break }
      modkey = values[4] === 51 ? 'Alt' : 'Ctrl'
      // ctrl/alt modified function keys (1 to 4)
      if (values[5] > 79 && values[5] < 84) {
        if (values[4] === 55) { break } // stdin will not catch Ctrl+Alt+FNKEY
        return `${modkey}+F${values[5] - 79}`
      }
      // ctrl/alt modified arrow keys
      if (values[5] > 64 && values[5] < 69) {
        if (values[4] === 55) { modkey = 'Ctrl+Alt' }
        return `${modkey}+Arrow${arrows[values[5] - 65]}`
      }
      break
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
*/

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

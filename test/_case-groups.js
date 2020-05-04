
const buffer2array = (buf) => Array.prototype.map.call(buf, c => c)
const mapChar = (ch) => [buffer2array(Buffer.from(ch)), ch]

const numbers = '0123456789'
const abcdary = 'abcdefghijklmnopqrstuvwxyz'

/**
 * Test case generation
 *
 * Let's create case group arrays with the following format:
 *
 * ```
 * [
 *   // first element is the buffer values, second is "humanized"
 *   [ [0x00], 'Ctrl+Space' ],
 *   [ [0x01], 'Ctrl+A' ],
 *   [ [0x02], 'Ctrl+B' ],
 *   // etc...
 * ]
 * ```
 *
 */

/**
 * control characters 1 byte length (0 to 31)
 *
 * - 0  (NUL): ^@ - Ctrl+Space ou Ctrl+2 - Carácter nulo (Null)
  // 1  (SOH): ^A - Inicio do encabezado (Start of heading)
  // 2  (STX): ^B - Comezo do texto (Start of text)
  // 3  (ETX): ^C - Fin do texto (End of text)
  // 4  (EOT): ^D - Fin da transmisión (End of transmission)
  // 5  (ENQ): ^E - Consulta (Enquiry)
  // 6  (ACK): ^F - Acuse de recibo (Acknowledge)
  // 7  (BEL): ^G - Campá (Bell)
  // 8   (BS): ^H - Ctrl+H ou Ctrl+Backspace - Retroceso (Backspace)
  // 9   (HT): ^I - Ctrl+I ou Tab - Tabulación horizontal
  // 10  (LF): ^J - Salto de liña (Line Feed aka New Line)
  // 11  (VT): ^K - Tabulación Vertical
  // 12  (FF): ^L - Avance de Páxina (Form Feed)
  // 13  (CR); ^M - Ctrl+M ou Enter - Retorno (Carriage Return)
  // 14  (SO): ^N - Desactivar mayúsculas (shift out)
  // 15  (SI): ^O - Activar mayúsculas (shift in)
  // 16 (DLE): ^P - Enlace de datos (Data Link Escape)
  // 17 (DC1): ^Q - Dispositivo de control 1
  // 18 (DC2): ^R - Dispositivo de control 2
  // 19 (DC3): ^S - Dispositivo de control 3
  // 20 (DC4): ^T - Dispositivo de control 4
  // 21 (NAK): ^U - Confirmación negativa
  // 22 (SYN): ^V - Síncrono en espera
  // 23 (ETB): ^W - Fin de transmisión do bloque
  // 24 (CAN): ^X - Cancelar
  // 25  (EM): ^Y - Finalización do Medio
  // 26 (SUB): ^Z - Substitución
  // 27 (ESC): ^[ - Ctrl+3 ou Escape - Escape
  // 28  (FS): ^\ - Ctrl+4 - Separador de ficheiro
  // 29  (GS): ^] - Ctrl+5 - Separador de grupo
  // 30  (RS): ^^ - Ctrl+6 - Separador de rexistro
  // 31  (US): ^_ - Ctrl+7 - Separador de unidade
  // Ctrl+8 escupe o código 127 (Backspace)
  // 'Backspace', // 127 (DEL): ^? - Ctrl+8 - Eliminar (Delete)
  // Ctrl+9 escupe o código 57 (número 9)
  // Ctrl+0 non escupe código
  // Ctrl+1 non escupe código
 *
 */

// Note: Null character is also generated with Ctrl+2
exports.control = [[[0], 'Ctrl+Space']]
exports.controlAlt = [[[27, 0], 'Ctrl+Alt+Space']]
// some Ctrl+${thing} codes have special keys as shortcuts
const ctrl = { 9: 'Tab', 13: 'Enter', 27: 'Escape' }
// each letter (and some numbers) have a control char (from [1] to [31]
;(abcdary + 34567)
  .toUpperCase().split('')
  .forEach((letter, position) => {
    const code = position + 1
    let key, altKey
    if (typeof ctrl[code] !== 'undefined') {
      key = ctrl[code]
      altKey = `Alt+${key}`
    } else {
      key = `Ctrl+${letter}`
      altKey = `Ctrl+Alt+${letter}`
    }
    exports.control.push([[code], key])
    exports.controlAlt.push([[27, code], altKey])
  })

//
// printable characters 1 byte length ("latin basic" subset)
// codes from 32 to 127
//
// 1 byte "symbol" chars (33 to 47; 58 to 64; 91 to 96; 123 to 126)
const symbols = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
exports.symbols = symbols.split('').map(mapChar)
// TODO symbolsAlt
// consider "Space" (code 32) a special case and call it 'Space'
exports.symbols.unshift([[32], 'Space'], [[27, 32], 'Alt+Space'])
exports.basic = []
exports.basicAlt = []
// numbers (48 to 57); uppercase (65 to 90); lowercase (97 to 122)
;(numbers + abcdary.toUpperCase() + abcdary)
  .split('')
  .forEach(character => {
    const code = buffer2array(Buffer.from(character))
    exports.basic.push([code.slice(0), character])
    code.unshift(27)
    exports.basicAlt.push([code.slice(0), `Alt+${character}`])
  })
// consider backspace (code 127) a control group case
exports.control.push([[127], 'Backspace'])
exports.controlAlt.push([[27, 127], 'Alt+Backspace'])

//
// control characters 2 byte length (part of "latin-1 supplement")
// codes from [194, 128] to [194, 160]
//

//
// printable characters 2 byte length
//
const print2 = (base, min, max) => Array(max - min).fill('').map((v, i) => {
  const seq = [base, min + i]
  return [seq, Buffer.from(seq).toString()]
})
const range2 = (arr) => arr.map(args => print2(...args)).flat(1)
// printable 2 byte symbol chars
exports.symbols2 = range2([
  [194, 161, 191], // [194, 161] to [194, 191] (part of "latin-1 supplement")
  [199, 128, 131] // [199, 128] to [199, 131] (part of "latin extended-A")
])
// TODO symbol  [194, 173] (soft hyphen) seems displayed as space
// printable 2 byte "latin-1 supplement" letters
// codes from [195, 128] to [195, 191]
exports.latin1 = print2(195, 128, 191)
// printable 2 byte "latin extended-A" letters
exports.latinA = range2([
  [196, 128, 191], // [196, 128] to [196, 191]
  [197, 128, 191] // [197, 128] to [197, 191]
])
// printable 2 byte "latin extended-b" letters
exports.latinB = range2([
  [198, 128, 191], // [198, 128] to [198, 191]
  [199, 132, 191], // [199, 132] to [199, 191]
  [200, 128, 191], // [200, 128] to [200, 191]
  [201, 128, 143] // [201, 128] to [201, 143]
])

//
// printable 3 byte symbol characters
//
const symbols3 = '€←↑→↓“”'
exports.symbols3 = symbols3.split('').map(mapChar)

// TODO more printable characters
// see https://unicode-table.com/en/blocks/
// NOTE: there are lots of unicode characters which a keboard can't generate

//
// TODO 4 byte control sequences
//

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

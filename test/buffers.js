
const buffer2array = (buf) => Array.prototype.map.call(buf, c => c)
const mapChar = (ch) => [buffer2array(Buffer.from(ch)), ch]

/**
 * Test case generation
let cases = [
  // first element is the buffer values, second is "humanized"
  [ [0x00], 'NUL' ]
  [ [0x01], 'Ctrl+A' ],
  [ [0x02], 'Ctrl+B' ],
  // etc...
]
*/

//
// control characters 1 byte length (0 to 31)
//
const ctrl = [
  'Ctrl+2', // 0  (NUL): ^@ - Carácter nulo (Null)
  'Ctrl+A', // 1  (SOH): ^A - Inicio do encabezado (Start of heading)
  'Ctrl+B', // 2  (STX): ^B - Comezo do texto (Start of text)
  'Ctrl+C', // 3  (ETX): ^C - Fin do texto (End of text)
  'Ctrl+D', // 4  (EOT): ^D - Fin da transmisión (End of transmission)
  'Ctrl+E', // 5  (ENQ): ^E - Consulta (Enquiry)
  'Ctrl+F', // 6  (ACK): ^F - Acuse de recibo (Acknowledge)
  'Ctrl+G', // 7  (BEL): ^G - Campá (Bell)
  'Ctrl+H', // 8   (BS): ^H - Retroceso (Backspace)
  'Tab', // 9   (HT): ^I - Ctrl+I - Tabulación horizontal
  'Ctrl+J', // 10  (LF): ^J - Salto de liña (Line Feed aka New Line)
  'Ctrl+K', // 11  (VT): ^K - Tabulación Vertical
  'Ctrl+L', // 12  (FF): ^L - Avance de Páxina (Form Feed)
  'Enter', // 13  (CR); ^M - Ctrl+M - Retorno (Carriage Return)
  'Ctrl+N', // 14  (SO): ^N - Desactivar mayúsculas (shift out)
  'Ctrl+O', // 15  (SI): ^O - Activar mayúsculas (shift in)
  'Ctrl+P', // 16 (DLE): ^P - Enlace de datos (Data Link Escape)
  'Ctrl+Q', // 17 (DC1): ^Q - Dispositivo de control 1
  'Ctrl+R', // 18 (DC2): ^R - Dispositivo de control 2
  'Ctrl+S', // 19 (DC3): ^S - Dispositivo de control 3
  'Ctrl+T', // 20 (DC4): ^T - Dispositivo de control 4
  'Ctrl+U', // 21 (NAK): ^U - Confirmación negativa
  'Ctrl+V', // 22 (SYN): ^V - Síncrono en espera
  'Ctrl+W', // 23 (ETB): ^W - Fin de transmisión do bloque
  'Ctrl+X', // 24 (CAN): ^X - Cancelar
  'Ctrl+Y', // 25  (EM): ^Y - Finalización do Medio
  'Ctrl+Z', // 26 (SUB): ^Z - Substitución
  'Escape', // 27 (ESC): ^[ - Ctrl+3 - Escape (ou Ctrl+3)
  'Ctrl+4', // 28  (FS): ^\ - Ctrl+4 - Separador de ficheiro
  'Ctrl+5', // 29  (GS): ^] - Ctrl+5 - Separador de grupo
  'Ctrl+6', // 30  (RS): ^^ - Ctrl+6 - Separador de rexistro
  'Ctrl+7' // 31  (US): ^_ - Ctrl+7 - Separador de unidade
  // Ctrl+8 escupe o código 127 (Backspace)
  // 'Backspace', // 127 (DEL): ^? - Ctrl+8 - Eliminar (Delete)
  // Ctrl+9 escupe o código 57 (número 9)
  // Ctrl+0 non escupe código
]

exports.control = ctrl.map((str, idx) => [[idx], str])
exports.control.push([[127], 'Backspace'])

//
// printable characters 1 byte length ("latin basic" subset)
// codes from 32 to 127
//
const numbers = '0123456789'
const abcdary = 'abcdefghijklmnopqrstuvwxyz'
const symbols = ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
// pritable number characters (48 to 57)
exports.numbers = numbers.split('').map(mapChar)
// printable uppercase letter characters (65 to 90)
exports.uppercase = abcdary.toUpperCase().split('').map(mapChar)
// printable lowercase letter characters (97 to 122)
exports.lowercase = abcdary.split('').map(mapChar)
// printable 1 byte symbol chars (32 to 47; 58 to 64; 91 to 96; 123 to 126)
exports.symbols = symbols.split('').map(mapChar)

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

//
// 4 byte control sequences
//

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

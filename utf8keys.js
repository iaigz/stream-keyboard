
module.exports = {
  //
  // 0 to 31 (and 127 too) are Ctrl sequences
  //
  // values from 1 to 26 are Ctrl+[a-z],
  // but some codes collide with special keys
  '\u0000': 'Ctrl+2', // 0 (NUL): ^@ - Null character
  '\u0001': 'Ctrl+A', // 1 (SOH): ^A - Start of heading
  '\u0002': 'Ctrl+B', // 2 (STX): ^B - Start of text
  '\u0003': 'Ctrl+C', // 3 (ETX): ^C - End of text
  '\u0004': 'Ctrl+D', // 4 (EOT): ^D - End of transmission
  '\u0005': 'Ctrl+E', // 5 (ENQ): ^E - Consulta
  '\u0006': 'Ctrl+F', // 6 (ACK): ^F - Acuse de recibo
  '\u0007': 'Ctrl+G', // 7 (BEL): ^G - Bell
  '\b': 'Ctrl+H', // 8  (BS): ^H - Backspace
  '\t': 'Tab', // 9  (HT): ^I - Horizontal tab
  '\n': 'Ctrl+J', // 10 (LF): ^J - Line feed
  '\u000b': 'Ctrl+K', // 11 (VT): ^K - Vertical tab
  '\f': 'Ctrl+L', // 12 (FF): ^L - "Avance de Página"
  '\r': 'Enter', // 13 (CR); ^M - Enter key or Ctrl+M
  '\u000e': 'Ctrl+N', // 14 (SO): ^N - "Desactivar mayúsculas"
  '\u000f': 'Ctrl+O', // 15 (SI): ^O - "Activar mayúsculas"
  '\u0010': 'Ctrl+P', // 16 (DLE): ^P
  '\u0011': 'Ctrl+Q', // 17 (DC1): ^Q
  '\u0012': 'Ctrl+R', // 18 (DC2): ^R
  '\u0013': 'Ctrl+S', // 19 (DC3): ^S
  '\u0014': 'Ctrl+T', // 20 (DC4): ^T
  '\u0015': 'Ctrl+U', // 21 (NAK): ^U
  '\u0016': 'Ctrl+V', // 22 (SYN): ^V
  '\u0017': 'Ctrl+W', // 23 (ETB): ^W - End of transmission block
  '\u0018': 'Ctrl+X', // 24 (CAN): ^X - Cancel
  '\u0019': 'Ctrl+Y', // 25 (EM): ^Y
  '\u001a': 'Ctrl+Z', // 26 (SUB): ^Z - "Substitución"
  '\u001b': 'Esc', // 27 (ESC): ^[ - Escape key or Ctrl+3
  '\u001c': 'Ctrl+4', // 28 (FS): ^\ - Ctrl+4
  '\u001d': 'Ctrl+5', // 29 (GS): ^] - Ctrl+5
  '\u001e': 'Ctrl+6', // 30 (RS): ^^ - Ctrl+6
  '\u001f': 'Ctrl+7', // 31 (US): ^_ - Ctrl+7

  '': 'Backspace', // 127 (DEL): ^? - Backspace or Ctrl+8

  //
  // 32 to 126 are the printable characters
  //
  ' ': 'Space', // 32 is the blank space - map to 'Space' to simplify parsing
  // following keys don't need mapping
  // values from 33 to 47 are the following symbols: !"#$%&'()*+,-./
  // values from 48 to 57 are numbers [0-9]
  // values from 58 to 64 are the following symbols: :;<=>?@
  // values from 65 to 90 are uppercase letters [A-Z]
  // values from 91 to 96 are the following symbols: [\]^_`
  // values from 97 to 122 are lowercase letters [a-z]
  // values from 123 to 126 are the following symbols: {|}~
  //
  // Key combos
  //
  // availability of this key combinations depends on host system,
  // i.e., on any linux DE some combos are caught by the display manager.
  // try it from a text-only environment (Ctrl+Alt+2, i.e.)
  '\u001b0': 'Alt+0', // [27,48]
  '\u001b1': 'Alt+1', // [27,49]
  '\u001b2': 'Alt+2', // [27,50]
  '\u001b3': 'Alt+3', // [27,51]
  '\u001b4': 'Alt+4', // [27,52]
  '\u001b5': 'Alt+5', // [27,53]
  '\u001b6': 'Alt+6', // [27,54]
  '\u001b7': 'Alt+7', // [27,55]
  '\u001b8': 'Alt+8', // [27,56]
  '\u001b9': 'Alt+9', // [27,57]
  // same applies for Alt+[lowercase letter]
  // same applies for Alt+[uppercase letter]
  // same applies for any printable character
  // it's the escape code followed by the character as-is

  //
  // Special keys
  //

  '\u001b[2~': 'Insert', // [27,91,50,126] - Insert key
  '\u001b[3~': 'Delete', // [27,91,51,126] - Delete key
  '\u001b[5~': 'RePag', // [27,91,52,126] - Page up
  '\u001b[6~': 'AvPag', // [27,91,53,126] - Page down

  '\u001b[A': 'ArrowUp',    // [27,91,65]
  '\u001b[B': 'ArrowDown',  // [27,91,66]
  '\u001b[C': 'ArrowRight', // [27,91,67]
  '\u001b[D': 'ArrowLeft'   // [27,91,68]
}

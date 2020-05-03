const assert = require('assert')
const { Transform, Readable } = require('stream')

// utility to compare if one array and one buffer are equivalent
const equivalent = (array, buffer) => {
  return array.length === buffer.length &&
    array.every((val, key) => val === buffer[key])
}
// const Aslice = Array.prototype.slice

const Log = require('@iaigz/core-log')
const log = new Log()
log.level = Log.VERB

const prohibit = (opts, keys) => keys.forEach(key => {
  if (typeof opts[key] !== 'undefined') {
    throw new TypeError(`usage of opts.${key} is not allowed`)
  }
})

/**
 * @class Keyboard
 *
 * reads keyboard strokes from any readable stream
 *
 * if opts.t is given, it will timeout reading after 't' ms without data
 *
 * opts.sigint is the keycode to interpret as 'end of input stream'
 */

class Keyboard extends Transform {
  constructor (opts = {}) {
    if (opts instanceof Readable) opts = { input: opts }
    if (typeof opts.sigint === 'number') {
      opts = { ...opts, sigint: [opts.sigint] }
    }
    // keys not allowed to exist on options object
    prohibit(opts, ['sources', 'traps', 'timeout'])

    super()

    this._kbd = {
      // options for behaviour
      t: 0, // max seconds waiting for input until 'end' (disabled by default)
      input: null, // Readable stream to pipe into
      sigint: [3], // keycode to interpret as 'end of input stream' (Ctrl+C)
      humanize: false, // whenever to convert input keycodes to a string
      // internal data
      sources: [],
      traps: Object.create(null),
      timeout: null,
      ...opts
    }
    if (this._kbd.input !== null) {
      assert(opts.input instanceof Readable, 'opts.input must be Readable')
    }

    // actions to do when sources are piped-in (usually process.stdin)
    this.on('pipe', source => {
      if (~this._kbd.sources.indexOf(source)) {
        return log.warn('same source piped in twice')
      }

      const id = this._kbd.sources.push(source) - 1
      log.verb('source %s piped into key stream', id)

      // setup timeout when appropiate
      if (this._kbd.t && this._kbd.timeout === null) this._setTimeout()

      // handle RawMode when appropiate
      if (source.isTTY && !source.isRaw) {
        source.setRawMode(true)
        const trap = () => {
          if (!source.isRaw) return
          log.warn('trapped a process\' exit while TTY source was in raw mode')
          source.setRawMode(false)
        }
        process.prependListener('exit', trap)
        this._kbd.traps[id] = trap
      }
    })
    // actions to do when sources are piped-out (usually process.stdin)
    this.on('unpipe', source => {
      const id = this._kbd.sources.indexOf(source)
      if (~id) {
        this._kbd.sources.splice(id, 1)
        log.verb('source %s was unpiped', id)
      } else {
        return log.warn('an unkown source was unpiped')
      }

      // handle timeout clearing when appropiate
      if (!this._kbd.sources.length && this._kbd.timeout) {
        clearTimeout(this._kbd.timeout)
        log.verb('no sources left, clearing timeout')
      }

      // handle RawMode when appropiate
      if (source.isTTY) {
        if (source.isRaw) {
          source.setRawMode(false)
          // trick to gracefully exit when reading from process.stdin
          source === process.stdin && source.resume().pause()
        }
        if (this._kbd.traps[id]) {
          process.removeListener('exit', this._kbd.traps[id])
          delete this._kbd.traps[id]
        }
      }
    })
  }

  _transform (chunk, encoding, callback) {
    // refresh timeout mechanics when aplicable
    if (this._kbd.t) {
      clearTimeout(this._kbd.timeout)
      this._setTimeout()
    }
    // assume each chunk is a keystroke
    callback(null, chunk)
    if (equivalent(this._kbd.sigint, chunk)) {
      log.info('Ending on keycode %j', this._kbd.sigint)
      return this.end()
    }
  }

  _setTimeout () {
    if (!this._kbd.t) throw new Error('invalid _setTimeout call')
    // this is the action that runs when timed out
    this._kbd.timeout = setTimeout(() => {
      log.info('keyboard stream timed out')
      if (this.listenerCount('timeout')) {
        this.emit('timeout')
      } else {
        const error = new Error('Keyboard stream timeout')
        error.code = 'KEYBOARD_TIMEOUT'
        this.emit('error', error)
      }
      this.end()
    }, this._kbd.t * 1000)
    log.verb('keyboard stream will timeout in %ss', this._kbd.t)
  }
}

module.exports = Keyboard

/* function readkeys (opts) {

  output._transform = function _go (chunk, encoding, callback) {
    log.debug('keyboard processing %j', Aslice.call(chunk))
    // TODO may be reading buffered data!!
    // if 'chunk is not a key combo' => 'do NOT push data, discard it'
    // apply conversion to human-readable key combo if desired
    callback(null, opts.humanize ? keystroke(chunk) : chunk)
    // line above is the same as `this.push(result); callback(null)`
    // detect 'end of input stream' key code (opts.sigint)
    if (~chunk.indexOf(opts.sigint)) {
      if (this.listeners('focuslost').length) {
        log.info('Focus lost on keycode %j', opts.sigint)
        return this.emit('focuslost')
      }
      log.warn('Ending on keycode %j', opts.sigint)
      return this.end()
    }
  }

  return opts.input ? opts.input.pipe(output) : output
}

// TODO this conversion strategy is still so ugly
const utf8keys = require('./utf8keys')
// const { format } = require('util')
function keystroke (buffer) {
  if (buffer.length === 1 && buffer[0] === 127) {
    return 'Backspace' // empty string can't be a key
  }
  return utf8keys[buffer.toString('utf8')] || buffer.toString('utf8')
}

*/

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

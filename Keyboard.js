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
    if (typeof opts.sources !== 'undefined') {
      throw new TypeError('opts.sources is not allowed')
    }

    super()

    this._kbd = {
      // options for behaviour
      t: 0, // max seconds waiting for input until 'end' (disabled by default)
      input: null, // Readable stream to pipe into
      sigint: [3], // keycode to interpret as 'end of input stream' (Ctrl+C)
      humanize: false, // whenever to convert input keycodes to a string
      // internal data
      sources: [],
      ...opts
    }
    if (this._kbd.input !== null) {
      assert(opts.input instanceof Readable, 'opts.input must be Readable')
    }

    // management of special sources piped-in (usually process.stdin)
    this.on('pipe', source => {
      /*
      if (~this._kbd.sources.indexOf(source)) {
        return log.error('same source piped in twice')
      }
      */
      this._kbd.sources.push(source)
      log.verb('source %s piped into key stream', this._kbd.sources.length - 1)
      // handle RawMode when appropiate
      if (source.isTTY && !source.isRaw) {
        source.setRawMode(true)
        // var disableRawMode = enableRawMode(source)
        // output.once('unpipe', src => src === source && disableRawMode())
      }
    })
    this.on('unpipe', source => {
      const id = this._kbd.sources.indexOf(source)
      if (~id) {
        this._kbd.sources.splice(id, 1)
        log.verb('source %s was unpiped', id)
      } else {
        log.warn('an unkown source was unpiped')
      }
    })
  }

  _transform (chunk, encoding, callback) {
    // assume each chunk is a keystroke
    callback(null, chunk)
    if (equivalent(this._kbd.sigint, chunk)) {
      log.info('Ending on keycode %j', this._kbd.sigint)
      return this.end()
    }
  }

  _final (callback) {
    this._kbd.sources.forEach(source => {
      if (source.isTTY && source.isRaw) source.setRawMode(false)
    })
    callback(null)
  }
}

module.exports = Keyboard

/**
 * @internal function enableRawMode
 *
 * helps managing raw mode for TTY sources
 *
 * this depends on @iaigz/core-log process bindings:
 *
 * - to detect uncaughException via 'exit' event on process
 * - to rely on default binding for SIGINT event on process
 *
 * basics from http://stackoverflow.com/a/21947851/1894803
 */
/*
function enableRawMode (stream) {
  stream.setRawMode(true)
  log.warn('raw mode enabled')
  var disable = () => {
    if (!stream.isRaw) {
      log.warn('will not disable raw mode because it is disabled already')
      return false
    }
    stream.setRawMode(false)
    log.warn('raw mode disabled')
  }
  var trap = (code) => {
    log[code ? 'warn' : 'info']('Caught exit with code %s', code)
    disable()
  }
  process.on('exit', trap)
  // returned function should be called to disable the raw mode
  return () => {
    process.removeListener('exit', trap)
    disable()
  }
}
*/

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
  // keeps logs readable
  if (!opts.t) delete opts.t
  if (!opts.input) delete opts.input
  if (!opts.humanize) delete opts.humanize

  log.info('keyboard created: %j', opts)

  output._final = function (callback) {
    if (~sources.indexOf(process.stdin)) {
      process.stdin.pause()
      log.warn('paused process.stdin')
    }
    return callback(null)
  }

  // management of RawMode for sources piped-in (usually process.stdin)
  output.on('pipe', source => {
    // handle RawMode when appropiate
    if (source.setRawMode && !source.isRaw) {
      var disableRawMode = enableRawMode(source)
      // TODO need? on 'focuslost' disableRawMode
      output.once('unpipe', src => src === source && disableRawMode())
    }
  })

  if (opts.t) {
    log.info('setting timeout mechanics (t=%s)', opts.t)
    // this is the action that runs when timed out
    var timeout = () => {
      if (output.listeners('timeout').length) {
        output.emit('timeout')
      } else {
        var error = new Error('Keyboard timeout')
        error.code = 'KEY_TIMEOUT'
        output.emit('error', error)
      }
      log.warn('keyboard timed out and will end now!')
      output.end()
    }
    // these are the timeout mechanism internals
    var to = null
    var forgive = () => to && clearTimeout(to)
    var refresh = () => {
      forgive()
      log.debug('keyboard will timeout in %ss', opts.t)
      to = setTimeout(timeout, opts.t * 1000)
    }
    // this is the logic implementing the timeout feature
    output.on('pipe', source => {
      refresh()
      source.on('data', refresh)
      output.once('finish', function () {
        source.removeListener('data', refresh)
        to && forgive()
        log.debug('keyboard stoped timeout forever')
      })
    })
  }

  // informational messages (for debugging)
  output
    // writable interface (input data)
    .on('close', () => log.info('output stream has closed'))
    .on('drain', () => log.verb('output stream has drained'))
    .on('finish', () => log.verb('output stream has finished'))
    // readable interface (output data)
    .on('end', () => log.verb('output stream has end'))
    // .on('readable', () => log.info('output stream becomes readable'))

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

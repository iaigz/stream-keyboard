#!/usr/bin/env node

const { Transform } = require('stream')

const Log = require('@iaigz/core-log')
const log = new Log()

const Keyboard = require('..')

// const keymap = require('../keymap.json')

log.warn('will start mapping keyboard')

process.stdin
  .pipe(new Keyboard({ sigint: false, t: 5 }))
  .on('readable', () => {
    log.warn('keyboard becomes readable')
  })
  .on('end', () => {
    log.info('keyboard has end, process should exit gracefully')
  })
  // amazing way to push an extra newline character after each humanized key
  .pipe(new Transform({
    readableObjectMode: true, // will produce arrays
    transform (chunk, enc, cb) {
      const array = Array.prototype.map.call(chunk, c => c)
      log.info('chunk:', chunk)
      log.info('array:', array)
      cb(null, array)
    }
  }))
  // pipe tranformed data to stdout
  .pipe(process.stdout)

/* vim: set expandtab: */
/* vim: set filetype=javascript ts=2 shiftwidth=2: */

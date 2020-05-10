# @iaigz/stream-keyboard

An utility to read keystroke codes from any readable stream.

## features

- Essentially, it's a Transform stream implementation.
- Handles TTY raw devices (like process.stdin sometimes) with care:
  - enables raw mode when a raw device is piped in
  - disables raw mode when a raw device is unpiped
  - always disables raw mode before process exit, even on unexpected exits/failures/signals.
- Optionally specify a code to interpret as "End-of-input-stream":
  - It defaults to code 3 (<kbd>Ctrl</kbd>+<kbd>C</kbd>)
  - Set to `false` to disable feature
- Optionally timeout after X seconds without data being read while flowing
- Optionally "humanize" the keystroke codes being read:
  - It passes data through as-is by default
  - "humanize" means transform keystroke codes to strings:
    - transforms `[13]` to _"Enter"_
    - transforms `[27]` to _"Escape"_
    - transforms `[0]` to _"Ctrl+Space"_
    - transforms `[27, 0]` to _"Ctrl+Alt+Space"_
    - transforms `[27, 91, 65]` to _"ArrowUp"_
    - transforms `[27, 91, 49, 59, 55, 67]` to _"Ctrl+Alt+ArrowRight"_
    - and so on. Try demo script to see it
- Optionally customize strategy used to _humanize_ codes with any `function (buffer) => [String]`

## install

```shell
npm install git://github.com/iaigz/stream-keyboard.git
```

## usage

```javascript
const Keyboard = require('@iaigz/stream-keyboard')

process.stdin
  .pipe(new Keyboard({ humanize: true }))
  // ...
  .pipe(process.stdout)
```

see [example/demo.js](https://github.com/iaigz/stream-keyboard/blob/master/example/demo.js)

## default options

```javascript
new Keyboard({
  // seconds to wait until timeout or error is emitted
  // falsy value disables feature
  t: 0,
  // keystroke code which causes stream to end
  // false disables feature
  sigint: 3,
  // whenever to humanize (transform to string) keystroke codes or not
  // any value given is coerced to boolean
  humanize: false,
  // function to humanize keystrokes as strings when issued to do so
  // strategy function interface is `(buffer) => [String]`
  strategy: require('@iaigz/stream-keyboard/strategy-unicode.js')
})
```

## test/demo

```shell
git clone git://github.com/iaigz/stream-keyboard.git
cd stream-keyboard

# runs all tests (including lint)
# expects standard to be installed globally
npm run test

# runs example/demo.js script
npm run demo
```

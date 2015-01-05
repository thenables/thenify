
/**
 * Module dependencies.
 */

var Promise = require('native-or-bluebird')
var assert = require('assert')
var createCallback = require('./thenify').createCallback
var promisify = require('./thenify').promisify
var thenify = require('./thenify')

/**
 * Export `thenify`.
 */

module.exports = thenifyWithCallback

/**
 * `thenify`.
 */

function thenifyWithCallback($$__fn__$$) {
  assert(typeof $$__fn__$$ === 'function')

  return eval(promisify({
    name: $$__fn__$$.name,
    withCallback: true
  }))
}

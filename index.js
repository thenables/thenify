
var Promise = require('any-promise')
var assert = require('assert')

module.exports = thenify

/**
 * Turn async functions into promises
 *
 * @param {Function} $$__fn__$$
 * @return {Function}
 * @api public
 */

function thenify($$__fn__$$) {
  assert(typeof $$__fn__$$ === 'function')
  return createWrapper($$__fn__$$)
}

/**
 * Turn async functions into promises and backward compatible with callback
 *
 * @param {Function} $$__fn__$$
 * @return {Function}
 * @api public
 */

thenify.withCallback = function ($$__fn__$$) {
  assert(typeof $$__fn__$$ === 'function')
  return createWrapper($$__fn__$$, true)
}

function createCallback(resolve, reject) {
  return function(err, value) {
    if (err) return reject(err)
    var length = arguments.length
    if (length <= 2) return resolve(value)
    var values = new Array(length - 1)
    for (var i = 1; i < length; ++i) values[i - 1] = arguments[i]
    resolve(values)
  }
}

function createWrapper(fn, withCallback) {
    var name = fn.name;
    name = (name || '').replace(/\s|bound(?!$)/g, '')
    var newFn = function() {
        var self = this
        var len = arguments.length
        if(withCallback){
          var lastType = typeof arguments[len - 1]
          if (lastType === "function") return fn.apply(self, arguments)
        }
        var args = new Array(len + 1)
        for (var i = 0; i < len; ++i) args[i] = arguments[i]
        var lastIndex = i
        return new Promise(function(resolve, reject) {
            args[lastIndex] = createCallback(resolve, reject)
            fn.apply(self, args)
        })
    }
    Object.defineProperty(newFn, "name", { value: name });
    return newFn;
}

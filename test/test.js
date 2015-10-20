
var assert = require('assert')

var thenify = require('..')

it('fn.name', function () {
  function someCrazyName() {}

  assert.equal('someCrazyName', thenify(someCrazyName).name)
  assert.equal('someCrazyName', thenify(someCrazyName).name)

  var noname = function () {}
  assert.equal('', thenify(noname).name)
})

it('fn.name (bound function)', function () {
  function bound() {}
  assert.equal('bound', thenify(bound).name)
  
  var noname = (function () {}).bind(this)
  assert.equal('', thenify(noname).name)
})

it('fn(callback(err))', function () {
  function fn(cb) {
    setTimeout(function () {
      cb(new Error('boom'))
    }, 0)
  }

  return thenify(fn)().then(function () {
    throw new Error('bang')
  }).catch(function (err) {
    assert.equal(err.message, 'boom')
  })
})

it('fn(callback(null, value))', function () {
  function fn(cb) {
    cb(null, true)
  }

  return thenify(fn)().then(function (val) {
    assert.equal(val, true)
  })
})

it('fn(callback(null, values...))', function () {
  function fn(cb) {
    cb(null, 1, 2, 3)
  }

  return thenify(fn)().then(function (values) {
    assert.deepEqual(values, [1, 2, 3])
  })
})

it('fn(..args, callback())', function () {
  function fn(a, b, c, cb) {
    cb(null, a, b, c)
  }

  return thenify(fn)(1, 2, 3).then(function (values) {
    assert.deepEqual(values, [1, 2, 3])
  })
})

'use strict';
/**
 * @module object-loops/reduce
 */
var isObject = require('101/is-object');
var forEach = require('./for-each');

/**
 * Applies a function against an accumulator and each value of the object to reduce it to a single value.
 * @function module:object-loops/reduce
 * @param {object} [obj] - object to reduce values, not accepted if being used directly on Object.prototype
 * @param {reduceCallback} callback - function to test each value in the object. return true to keep that entry, false otherwise.
 * @param {*} [initialValue] - optional. object to use as the first argument to the first call of the callback
 * @returns {*} finalValue - final value returned by reduction, or just first val if only one exists.
 */
module.exports = reduce;

function reduce (obj, callback, initialValue) {
  if (!isObject(obj)) {
    throw new TypeError(obj + ' is not an object');
  }
  if (typeof callback !== "function") {
    throw new TypeError(callback + ' is not a function');
  }
  var keys = Object.keys(obj);
  var noInitialValue = arguments.length < 3; // initial value can be null or undefined
  if (keys.length === 0 && noInitialValue) {
    throw new Error('Reduce of empty object with no initial value');
  }
  if (keys.length === 1 && noInitialValue) {
    return obj[keys[0]]; // return first value
  }
  var finalValue = noInitialValue ?
    keys.reduce(reduction) :
    keys.reduce(reduction, initialValue);
  function reduction (prevVal, key, i) {
    if (noInitialValue && i === 1) {
       // if no initial value, prevVal is first KEY
      prevVal = obj[prevVal];
    }
    var val = obj[key];
    var out = callback.call(null, prevVal, val, key, obj);
    return out;
  }

  return finalValue;

}
/**
 * This callback type is called `reduceCallback` and is displayed as a global symbol.
 * @callback reduceCallback
 * @param {*} previousValue - value previously returned in the last invocation of the callback, initialValue (if supplied), or first value in the object
 * @param {*} currentValue - current value being processed in the object
 * @param {string} key - key of the current value being processed in the object
 * @param {object} obj - object which values are being iterated
 * @returns {*} memo -  return true to keep that entry, false otherwise
 */
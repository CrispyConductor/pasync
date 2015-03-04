var async = require('async');
var Promise = require('es6-promise').Promise;

function throwIteratorMisuseError() {
	throw new Error('Do not call the callback when using pasync.  Return a promise instead.');
}

// Used as a placeholder if a promise is rejected without a reason
var placeholderError = new Error('An error occurred inside pasync');

function processResultError(err) {
	if(err === placeholderError) return undefined;
	return err;
}

/**
 * Constructs a replacement iterator function that wraps a
 * promise-based function.
 *
 * @param {Function} promiseIterator - The given promise-based iterator function
 * @param {Number} iteratorCallbackPos - The position of the callback in the iterator argument list
 * @param {Boolean} iteratorProvidesValue - If true, the iterator provides the promise resolve value as a callback argument
 * @param {Boolean} noErrors - If true, the iterator callback does not accept an initial error argument
 * @param {Function} unhandledErrorHandler - A function to be called if an error occurs when noErrors is set
 * @return {Function} - The wrapper function
 */
function constructIterator(promiseIterator, iteratorCallbackPos, iteratorProvidesValue, noErrors, unhandledErrorHandler) {
	return function() {

		var handleError = function(err) {
			if(!err) {
				err = placeholderError;
			}
			if(noErrors) {
				unhandledErrorHandler(err);
				iteratorCallback();
			} else {
				iteratorCallback(err);
			}
		};

		var iteratorCallback = arguments[iteratorCallbackPos];
		// Install a function in the iterator callback's place to avoid accidental misuse
		arguments[iteratorCallbackPos] = throwIteratorMisuseError;
		// iteratorResult can either be a promise or a value
		var iteratorResult;
		try {
			iteratorResult = promiseIterator.apply(this, arguments);
		} catch (ex) {
			// Treat exceptions as promise rejections
			setImmediate(function() {
				handleError(ex);
			});
			return;
		}
		if(iteratorResult && typeof iteratorResult.then === 'function') {
			iteratorResult.then(function(value) {
				if(iteratorProvidesValue) {
					if(noErrors) {
						iteratorCallback(value);
					} else {
						iteratorCallback(null, value);
					}
				} else {
					iteratorCallback();
				}
			}, function(err) {
				handleError(err);
			});
		} else {
			setImmediate(function() {
				if(iteratorProvidesValue) {
					if(noErrors) {
						iteratorCallback(iteratorResult);
					} else {
						iteratorCallback(null, iteratorResult);
					}
				} else {
					iteratorCallback();
				}
			});
		}
	};
}

/**
 * Given an async library function that involves an iterator and a
 * callback on completion, returns a promisified version.
 *
 * @param {Function} fn - The async library function
 * @param {Number} iteratorPos - The index of the iterator in the arguments array
 * @param {Number} iteratorCallbackPos - The index of the 'next' callback in the iterator's arguments
 * @param {Number} callbackPos - The index of the completion callback in the arguments array
 * @param {Boolean} iteratorProvidesValue - True if the iterator's callback accepts a second (value) argument
 * @param {Boolean} noErrors - True if the iterator does not receive an error to its callback and
 * the finish callback does not receive an error
 * @return {Function}
 */
function convertIteratorFunction(fn, iteratorPos, iteratorCallbackPos, callbackPos, iteratorProvidesValue, noErrors) {

	return function() {

		var promiseIterator = arguments[iteratorPos];

		if(arguments[callbackPos] !== undefined) {
			throw new Error('Do not supply a callback when using psaync.  This function returns a promise.');
		}

		// Some async functions (such as filter) do not handle errors.
		// In these cases, we handle errors out-of-band.
		var firstUnhandledError;

		var newIterator = constructIterator(promiseIterator, iteratorCallbackPos, iteratorProvidesValue, noErrors, function(err) {
			firstUnhandledError = err;
		});

		var fnArgs = arguments;

		return new Promise(function(resolve, reject) {

			fnArgs[callbackPos] = function(err, value) {
				if(firstUnhandledError) {
					reject(processResultError(firstUnhandledError));
				} else if(noErrors) {
					resolve(err);
				} else if(err) {
					reject(processResultError(err));
				} else {
					resolve(value);
				}
			};
			if(callbackPos >= fnArgs.length) fnArgs.length = callbackPos + 1;

			fnArgs[iteratorPos] = newIterator;

			fn.apply(this, fnArgs);

		}.bind(this));

	}.bind(async);
}

function convertTaskListFunction(fn, iteratorPos, iteratorCallbackPos, callbackPos, iteratorProvidesValue) {
	return function() {

		if(arguments[callbackPos] !== undefined) {
			throw new Error('Do not supply a callback when using psaync.  This function returns a promise.');
		}

		var newIterator;
		if(Array.isArray(arguments[iteratorPos])) {
			newIterator = arguments[iteratorPos].map(function(iterator) {
				return constructIterator(iterator, iteratorCallbackPos, iteratorProvidesValue);
			});
		} else {
			newIterator = constructIterator(arguments[iteratorPos], iteratorCallbackPos, iteratorProvidesValue);
		}

		var fnArgs = arguments;

		return new Promise(function(resolve, reject) {

			fnArgs[callbackPos] = function(err, value) {
				if(err) {
					reject(processResultError(err));
				} else {
					resolve(value);
				}
			};
			if(callbackPos >= fnArgs.length) fnArgs.length = callbackPos + 1;

			fnArgs[iteratorPos] = newIterator;

			fn.apply(this, fnArgs);

		}.bind(this));

	}.bind(async);
}

// Iterator functions

// fn, iteratorPos, iteratorCallbackPos, callbackPos, iteratorProvidesValue, noErrors
exports.each = convertIteratorFunction(async.each, 1, 1, 2, false, false);
exports.eachSeries = convertIteratorFunction(async.eachSeries, 1, 1, 2, false, false);
exports.eachLimit = convertIteratorFunction(async.eachLimit, 2, 1, 3, false, false);
exports.map = convertIteratorFunction(async.map, 1, 1, 2, true, false);
exports.mapSeries = convertIteratorFunction(async.mapSeries, 1, 1, 2, true, false);
exports.mapLimit = convertIteratorFunction(async.mapLimit, 2, 1, 3, true, false);
exports.filter = convertIteratorFunction(async.filter, 1, 1, 2, true, true);
exports.select = exports.filter;
exports.filterSeries = convertIteratorFunction(async.filterSeries, 1, 1, 2, true, true);
exports.selectSeries = exports.filterSeries;
exports.reject = convertIteratorFunction(async.reject, 1, 1, 2, true, true);
exports.rejectSeries = convertIteratorFunction(async.rejectSeries, 1, 1, 2, true, true);
exports.reduce = convertIteratorFunction(async.reduce, 2, 2, 3, true, false);
exports.inject = exports.reduce;
exports.foldl = exports.reduce;
exports.reduceRight = convertIteratorFunction(async.reduceRight, 2, 2, 3, true, false);
exports.foldr = exports.reduceRight;
exports.detect = convertIteratorFunction(async.detect, 1, 1, 2, true, true);
exports.detectSeries = convertIteratorFunction(async.detectSeries, 1, 1, 2, true, true);
exports.sortBy = convertIteratorFunction(async.sortBy, 1, 1, 2, true, false);
exports.some = convertIteratorFunction(async.some, 1, 1, 2, true, true);
exports.every = convertIteratorFunction(async.every, 1, 1, 2, true, true);
exports.concat = convertIteratorFunction(async.concat, 1, 1, 2, true, false);
exports.concatSeries = convertIteratorFunction(async.concatSeries, 1, 1, 2, true, false);

// Task functions
exports.series = convertTaskListFunction(async.series, 0, 0, 1, false, false);
exports.parallel = convertTaskListFunction(async.parallel, 0, 0, 1, false, false);
exports.parallelLimit = convertTaskListFunction(async.parallelLimit, 0, 0, 2, false, false);
exports.whilst = convertTaskListFunction(async.whilst, 1, 0, 2, false, false);

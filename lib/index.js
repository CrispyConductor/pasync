var async = require('neo-async');
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
 * @param {Number} iteratorCallbackPos - The position of the callback in the iterator argument list, if <0, tries to autodetect
 * @param {Boolean} iteratorProvidesValue - If true, the iterator provides the promise resolve value as a callback argument
 * @param {Boolean} noErrors - If true, the iterator callback does not accept an initial error argument
 * @param {Function} unhandledErrorHandler - A function to be called if an error occurs when noErrors is set
 * @return {Function} - The wrapper function
 */
function constructIterator(promiseIterator, iteratorCallbackPos, iteratorProvidesValue, noErrors, unhandledErrorHandler) {
	return function() {

		var args = Array.prototype.slice.call(arguments, 0);

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

		var iteratorCallback;
		if(iteratorCallbackPos >= 0) {
			iteratorCallback = args[iteratorCallbackPos];
		} else {
			for(var i = 0; i < args.length; i++) {
				if(typeof args[i] === 'function') {
					iteratorCallback = args[i];
				}
			}
		}
		// Install a function in the iterator callback's place to avoid accidental misuse
		args[iteratorCallbackPos] = throwIteratorMisuseError;
		// iteratorResult can either be a promise or a value
		var iteratorResult;
		try {
			iteratorResult = promiseIterator.apply(this, args);
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
			}).then(undefined, function(err) {
				// Throw error in global
				setImmediate(function() {
					throw err;
				});
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
	if(typeof fn !== 'function') return fn;

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

			fn.apply(async, fnArgs);

		});

	};
}

function convertTaskFunction(fn, iteratorPos, iteratorCallbackPos, callbackPos, iteratorProvidesValue) {
	if(typeof fn !== 'function') return fn;

	return function() {

		if(arguments[callbackPos] !== undefined) {
			throw new Error('Do not supply a callback when using psaync.  This function returns a promise.');
		}

		var newIterator;
		if(Array.isArray(arguments[iteratorPos])) {
			newIterator = arguments[iteratorPos].map(function(iterator) {
				return constructIterator(iterator, iteratorCallbackPos, iteratorProvidesValue);
			});
		} else if(typeof arguments[iteratorPos] === 'object') {
			var obj = arguments[iteratorPos];
			Object.keys(obj).forEach(function(iterator) {
				obj[iterator] = constructIterator(obj[iterator], iteratorCallbackPos, iteratorProvidesValue);
			});
			newIterator = obj;
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

			fn.apply(async, fnArgs);

		});

	};
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
exports.series = convertTaskFunction(async.series, 0, 0, 1, true);
exports.parallel = convertTaskFunction(async.parallel, 0, 0, 1, true);
exports.parallelLimit = convertTaskFunction(async.parallelLimit, 0, 0, 2, true);
exports.whilst = convertTaskFunction(async.whilst, 1, 0, 2, false);
exports.doWhilst = convertTaskFunction(async.doWhilst, 0, 0, 2, false);
exports.until = convertTaskFunction(async.until, 1, 0, 2, false);
exports.doUntil = convertTaskFunction(async.doUntil, 0, 0, 2, false);
exports.forever = convertTaskFunction(async.forever, 0, 0, 1, false);
// Note: waterfall with promises does not support multiple result args
exports.waterfall = convertTaskFunction(async.waterfall, 0, -1, 1, true);

// Misc Functions

exports.compose = function() {
	var promiseFns = Array.prototype.slice.call(arguments, 0);
	var callbackFns = promiseFns.map(function(promiseFn) {
		return constructIterator(promiseFn, 1, true, false);
	});
	var resultCallbackFn = async.compose.apply(async, callbackFns);
	return function(arg) {
		var self = this;
		return new Promise(function(resolve, reject)  {
			resultCallbackFn.call(self, arg, function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
		});
	};
};

exports.seq = function() {
	var promiseFns = Array.prototype.slice.call(arguments, 0);
	promiseFns.reverse();
	return exports.compose.apply(exports, promiseFns);
};

exports.applyEach = function() {
	var promiseFns = arguments[0];
	var callback = arguments[arguments.length - 1];
	var fnArgs = Array.prototype.slice.call(arguments, 1);
	var callbackFns = promiseFns.map(function(promiseFn) {
		return constructIterator(promiseFn, fnArgs.length, false, false);
	});
	return new Promise(function(resolve, reject) {
		async.applyEach.apply(async, [callbackFns].concat(fnArgs).concat([function(err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		}]));
	});
};

exports.applyEachSeries = function() {
	var promiseFns = arguments[0];
	var callback = arguments[arguments.length - 1];
	var fnArgs = Array.prototype.slice.call(arguments, 1);
	var callbackFns = promiseFns.map(function(promiseFn) {
		return constructIterator(promiseFn, fnArgs.length, false, false);
	});
	return new Promise(function(resolve, reject) {
		async.applyEachSeries.apply(async, [callbackFns].concat(fnArgs).concat([function(err) {
			if(err) {
				reject(err);
			} else {
				resolve();
			}
		}]));
	});
};

exports.queue = function(promiseWorker, concurrency) {
	var callbackWorker = constructIterator(promiseWorker, 1, false, false);
	var queue = async.queue(callbackWorker, concurrency);
	var origPush = queue.push;
	var origUnshift = queue.unshift;
	queue.push = function(task) {
		return new Promise(function(resolve, reject) {
			origPush.call(queue, task, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};
	queue.unshift = function(task) {
		return new Promise(function(resolve, reject) {
			origUnshift.call(queue, task, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};
	return queue;
};

exports.priorityQueue = function(promiseWorker, concurrency) {
	var callbackWorker = constructIterator(promiseWorker, 1, false, false);
	var priorityQueue = async.priorityQueue(callbackWorker, concurrency);
	var origPush = priorityQueue.push;
	priorityQueue.push = function(task, priority) {
		return new Promise(function(resolve, reject) {
			origPush.call(priorityQueue, task, priority, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};
	return priorityQueue;
};

exports.cargo = function(promiseWorker, payload) {
	var callbackWorker = constructIterator(promiseWorker, 1, false, false);
	var cargo = async.cargo(callbackWorker, payload);
	var origPush = cargo.push;
	cargo.push = function(task) {
		return new Promise(function(resolve, reject) {
			origPush.call(cargo, task, function(err) {
				if(err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	};
	return cargo;
};

exports.auto = function(tasks) {
	var keys = Object.keys(tasks);
	keys.forEach(function(task) {
		var promiseFn;
		var callbackFn = function(cb, results) {
			var promiseFnResult;
			try {
				promiseFnResult = promiseFn.call(this, results);
			} catch(ex) {
				cb(ex);
				return;
			}
			if(promiseFnResult && typeof promiseFnResult.then === 'function') {
				promiseFnResult.then(function(value) {
					cb(null, value);
				}, function(err) {
					cb(err, null);
				}).then(undefined, function(err) {
					setImmediate(function() {
						throw err;
					});
				});
			} else {
				cb(null, promiseFnResult);
			}
		};
		if(Array.isArray(tasks[task])) {
			promiseFn = tasks[task][tasks[task].length - 1];
			tasks[task][tasks[task].length - 1] = callbackFn;
		} else {
			promiseFn = tasks[task];
			tasks[task] = callbackFn;
		}
	});

	return new Promise(function(resolve, reject) {
		async.auto.call(async, tasks, function(err, result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.retry = function(times, task) {
	// Respect defaults by checking if no times is passed, or if it is passed as an object
	if(typeof times === 'function') {
		task = times;
		times = 5;
	} else if(typeof times === 'object') {
		times = times.times;
	}
	callbackTask = constructIterator(task, 0, true, false);
	return new Promise(function(resolve, reject) {
		async.retry(times, callbackTask, function(err, result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.apply = async.apply;

exports.nextTick = function(fn) {
	if(fn && typeof fn === 'function') {
		return async.nextTick(fn);
	} else {
		return new Promise(function(resolve) {
			async.nextTick(resolve);
		});
	}
};

exports.times = function(times, task) {
	var callbackTask = constructIterator(task, 1, false, false);
	return new Promise(function(resolve, reject) {
		async.times(times, callbackTask, function(err, result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.timesSeries = function(times, task) {
	var callbackTask = constructIterator(task, 1, false, false);
	return new Promise(function(resolve, reject) {
		async.timesSeries(times, callbackTask, function(err, result) {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};

exports.memoize = function(promiseFn, hasher) {
	var callbackFn = constructIterator(promiseFn, -1, true, false);
	var memoizedFn = async.memoize(callbackFn, hasher);

	var returnFn = function() {
		var args = Array.prototype.slice.call(arguments, 0);

		return new Promise(function(resolve, reject) {
			var memoCallbackFn = function(err, result) {
				if(err) {
					reject(err);
				} else {
					resolve(result);
				}
			};

			args.push(memoCallbackFn);
			memoizedFn.apply(this, args);
		});
	};

	returnFn.unmemoize = promiseFn;
	returnFn.memo = memoizedFn.memo;

	return returnFn;
};

exports.unmemoize = function(fn) {
	return fn.unmemoize;
};

exports.log = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	var promiseFn = args.shift();
	var callbackFn	= constructIterator(promiseFn, -1, true, false);
	args.unshift(callbackFn);
	async.log.apply(callbackFn, args);
};

exports.dir = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	var promiseFn = args.shift();
	var callbackFn	= constructIterator(promiseFn, -1, true, false);
	args.unshift(callbackFn);
	async.dir.apply(callbackFn, args);
};

// Neo-Async Functions
// fn, iteratorPos, iteratorCallbackPos, callbackPos, iteratorProvidesValue, noErrors
exports.concatLimit = convertIteratorFunction(async.concatLimit, 2, 1, 3, true, false);
exports.mapValues = convertIteratorFunction(async.mapValues, 1, 1, 2, true, false);
exports.mapValuesSeries = convertIteratorFunction(async.mapValuesSeries, 1, 1, 2, true, false);
exports.mapValuesLimit = convertIteratorFunction(async.mapValuesLimit, 2, 1, 3, true, false);
exports.detectLimit = convertIteratorFunction(async.detectLimit, 2, 1, 3, true, true);
exports.everySeries = convertIteratorFunction(async.everySeries, 1, 1, 2, true, true);
exports.everyLimit = convertIteratorFunction(async.everyLimit, 2, 1, 3, false, true);
exports.filterLimit = convertIteratorFunction(async.filterLimit, 2, 1, 3, true, true);
exports.pick = convertIteratorFunction(async.pick, 1, 1, 2, true, true);
exports.pickSeries = convertIteratorFunction(async.pickSeries, 1, 1, 2, true, true);
exports.pickLimit = convertIteratorFunction(async.pickLimit, 2, 1, 3, true, true);
exports.rejectLimit = convertIteratorFunction(async.rejectLimit, 2, 1, 3, true, true);
exports.selectLimit = exports.filterLimit;
exports.someSeries = convertIteratorFunction(async.someSeries, 1, 1, 2, true, true);
exports.someLimit = convertIteratorFunction(async.someLimit, 2, 1, 3, true, true);
exports.sortBySeries = convertIteratorFunction(async.sortBySeries, 1, 1, 2, true, false);
exports.sortByLimit = convertIteratorFunction(async.sortByLimit, 2, 1, 3, true, false);
exports.transform = convertIteratorFunction(async.transform, 1, -1, 2, false, false);
exports.transformSeries = convertIteratorFunction(async.transformSeries, 1, -1, 2, false, false);
exports.transformLimit = convertIteratorFunction(async.transformLimit, 2, -1, 3, false, false);
exports.timesLimit = convertIteratorFunction(async.timesLimit, 2, 1, 3, false, false);

// New Helper Functions
exports.abort = function(err) {
	exports.nextTick(function() {
		throw err;
	});
};

exports.all = function(initPromises) {
	var promiseCtr = 0;
	var retPromise;
	var retPromiseResolve, retPromiseReject;
	var promisesResolved = 0;
	var allResolved = false;
	var anyRejected = false;
	var results = [];
	var i;
	function setupRetPromise() {
		if (retPromise._pasync) return;
		Object.defineProperty(retPromise, '_pasync', { value: true });
		retPromise.then(function() {
			allResolved = true;
		}, function() {
			anyRejected = true;
		});
		retPromise.push = function(promise) {
			if (!promise || typeof promise.then !== 'function') {
				promise = promise.resolve(promise);
			}
			var promiseId = promiseCtr++;
			if (allResolved) {
				throw new Error('Tried to add promise to pasync.all() after already resolved');
			}
			if (anyRejected) {
				// Silently ignore (as if this were added before)
				return;
			}
			promise.then(function(result) {
				if (anyRejected) {
					// Silently fail if promise already rejected
					return;
				}
				results[promiseId] = result;
				promisesResolved++;
				if (promisesResolved === promiseCtr) {
					allResolved = true;
					retPromiseResolve(results);
				}
			}, function(err) {
				if (!allResolved && !anyRejected) {
					anyRejected = true;
					retPromiseReject(err);
				}
			});
		};
	}
	retPromise = new Promise(function(resolve, reject) {
		retPromiseResolve = resolve;
		retPromiseReject = reject;
	});
	setupRetPromise(retPromise);
	if (initPromises) {
		for (i = 0; i < initPromises.length; i++) {
			retPromise.push(initPromises[i]);
		}
	}
	return retPromise;
};

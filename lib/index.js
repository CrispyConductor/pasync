const pLimit = require('p-limit');


let tickFn;
if (typeof process === 'object' && typeof process.nextTick === 'function') {
	tickFn = process.nextTick;
} else if (typeof setImmediate === 'function') {
	tickFn = setImmediate;
} else {
	tickFn = function(fn) {
    	setTimeout(fn, 0);
	}
}


function breakoutFunctionArguments(funcArgs, argsOptions = {}) {
	let ret = { opArgs: [] };
	if (argsOptions.opIndexes) {
		for (let index of argsOptions.opIndexes) {
			if (index > funcArgs.length) {
				throw new Error('Not enough arguments to pasync function');
			}
			ret.opArgs.push(funcArgs[index]);
		}
	} else {
		ret.opArgs.push(...funcArgs);
	}
	if (argsOptions.limitIndex) {
		if (argsOptions.limitIndex > funcArgs.length) {
			throw new Error('Not enough arguments to pasync function');
		}
		ret.limit = funcArgs[argsOptions.limitIndex];
	}
	return ret;
}

// Wrappers for async collections that operate in parallel, series, or limit
function wrapParallel(opsFunc, argsOptions) {
	return async function() {
		let { opArgs } = breakoutFunctionArguments(Array.prototype.slice.call(arguments), argsOptions);
		let context = {};
		await Promise.all(opsFunc(context, ...opArgs)
			.map((func) => func()));

		if (typeof context.ret === 'function') return context.ret();
		if (context.ret !== undefined) return context.ret;
	};
}

function wrapSeries(opsFunc, argsOptions) {
	return async function() {
		let { opArgs } = breakoutFunctionArguments(Array.prototype.slice.call(arguments), argsOptions);
		let context = {};
		let ops = opsFunc(context, ...opArgs);
		for (let op of ops) {
			await op();
		}
		if (typeof context.ret === 'function') return context.ret();
		if (context.ret !== undefined) return context.ret;
	};
}

function wrapLimit(opsFunc, argsOptions) {
	return async function() {
		let { opArgs, limit } = breakoutFunctionArguments(Array.prototype.slice.call(arguments), argsOptions);
		let context = {};
		let limiter = pLimit(limit);
		let ops = opsFunc(context, ...opArgs)
			.map((op) => limiter(() => op()));
		await Promise.all(ops);
		if (typeof context.ret === 'function') return context.ret();
		if (context.ret !== undefined) return context.ret;
	}
}

// Processors for each async collection
// Each op function returns an array of promise-returning functions to execute

function eachOps(context, values, iter) {
	if (typeof values === 'object' && !Array.isArray(values)) {
		values = Object.values(values);
	}
	return values.map(function(value) {
		return async function() {
			await iter(value);
		};
	});
}

function mapOps(context, values, iter) {
	if (typeof values === 'object' && !Array.isArray(values)) {
		values = Object.values(values);
	}
	context.ret = new Array(values.length);
	return values.map(function(value, index) {
		return async function() {
			let retValue = await iter(value);
			context.ret[index] = retValue;
		};
	});
}

function mapValuesOps(context, values, iter) {
	let destructuredValues = [];
	if (Array.isArray(values)) {
		context.ret = new Array(values.length);
		for (let i = 0; i < values.length; i++) {
			destructuredValues.push({ key: i, value: values[i] });
		}
	} else {
		context.ret = {};
		for (let key in values) {
			destructuredValues.push({ key: key, value: values[key] });
		}
	}
	return destructuredValues.map(function(valueObj) {
		return async function() {
			let retValue = await iter(valueObj.value);
			context.ret[valueObj.key] = retValue;
		};
	});
}

function filterOps(context, values, iter) {
	context.unfilteredRet = new Array(values.length);
	context.ret = function() {
		return this.unfilteredRet.filter((elem) => (elem !== undefined));
	}
	return values.map(function(value, index) {
		return async function() {
			let shouldAccept = await iter(value);
			if (shouldAccept) {
				context.unfilteredRet[index] = value;
			} else {
				context.unfilteredRet[index] = undefined;
			}
		};
	});
}

function rejectOps(context, values, iter) {
	context.unfilteredRet = new Array(values.length);
	context.ret = function() {
		return this.unfilteredRet.filter((elem) => (elem !== undefined));
	}
	return values.map(function(value, index) {
		return async function() {
			let shouldReject = await iter(value);
			if (!shouldReject) {
				context.unfilteredRet[index] = value;
			} else {
				context.unfilteredRet[index] = undefined;
			}
		};
	});
}

function detectOps(context, values, iter) {
	return values.map(function(value) {
		return async function() {
			if (context.finished) return;
			let detected = await iter(value);
			if (detected && !context.finished) {
				context.finished = true;
				context.ret = value;
			}
		};
	});
}

function concatOps(context, values, iter) {
	context.ret = [];
	return values.map(function(value) {
		return async function() {
			let results = await iter(value);
			context.ret.push(...results);
		};
	});
}

function callOps(context, tasks) {
	context.ret = new Array(tasks.length);
	return tasks.map(function(task, index) {
		return async function() {
			let retValue = await task();
			context.ret[index] = retValue;
		};
	});
}

function timesOps(context, n, iter) {
	context.ret = new Array(n);
	let tasks = [];
	for (let i = 0; i < n; i++) {
		tasks.push(async function() {
			let retValue = await iter(i);
			context.ret[i] = retValue;
		});
	}
	return tasks;
}

function applyOps(context, tasks, ...taskArgs) {
	context.ret = new Array(tasks.length);
	return tasks.map(function(task, index) {
		return async function() {
			let retValue = await task(...taskArgs);
			context.ret[index] = retValue;
		};
	});
}


function reduceFunc(reverse = false) {
	return async function(values, memo, iter) {
		for (let i = 0; i < values.length; i++) {
			let curValue = !!reverse ? values[values.length - 1 - i] : values[i];
			memo = await iter(memo, curValue);
		}
		return memo;
	};
}

async function sortBy(values, iter) {
	let valueComparators = await (wrapParallel(mapOps))(values, iter);
	let objValues = values.map((value, index) => {
		return { value, index };
	});
	objValues.sort((a, b) => {
		return valueComparators[a.index] - valueComparators[b.index];
	});
	return objValues.map((obj) => obj.value);
}

function someFunc(invertTruthTest = false) {
	return async function(values, iter) {
		for (let value of values) {
			let pass = await iter(value);
			if (invertTruthTest) pass = !pass
			if (pass) {
				return !invertTruthTest;
			}
		}
		return invertTruthTest;
	}
}

function whilstFunc(doFirst = false, invertTruthTest = false) {
	return async function(test, task) {
		if (doFirst) {
			let tmp = test;
			test = task;
			task = tmp;
		}
		let itCount = 0;
		let taskRet;
		while (true) {
			if (!(doFirst && itCount === 0)) {
				let testResult = await test();
				if (invertTruthTest) testResult = !testResult;
				if (!testResult) break;
			}
			taskRet = await task();
			itCount++;
		}
		return taskRet;
	}
}

async function forever(task) {
	while (true) {
		await task();
	}
}

async function waterfall(tasks) {
	let lastRet;
	for (let task of tasks) {
		lastRet = await task(lastRet);
	}
	return lastRet;
}

function compose(...tasks) {
	return async function(...initArgs) {
		let lastRet;
		let taskCounter = 0;
		for (let task of tasks) {
			if (taskCounter === 0) {
				lastRet = await task(...initArgs);
			} else {
				lastRet = await task(lastRet);
			}
			taskCounter++;
		}
		return lastRet;
	}
}


function nextTick() {
	return new Promise(function(resolve) {
		tickFn(function() {
			resolve();
		});
	});
}
exports.nextTick = nextTick;
exports.setImmediate = nextTick;

function abort(err) {
	tickFn(function() {
		throw err;
	});
}
exports.abort = abort;

function pasyncSetTimeout(ms) {
	return new Promise(function(resolve) {
		setTimeout(function() {
			resolve();
		}, ms);
	});
}
exports.setTimeout = pasyncSetTimeout;

function asyncify(fn) {
	return async function(...args) {
		return await fn(...args);
	}
}
exports.asyncify = asyncify;
exports.wrapSync = asyncify;

function pasyncAll(initPromises) {
	let promiseCtr = 0;
	let retPromise;
	let retPromiseResolve, retPromiseReject;
	let promisesResolved = 0;
	let allResolved = false;
	let anyRejected = false;
	let results = [];

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
			let promiseId = promiseCtr++;
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
		for (let i = 0; i < initPromises.length; i++) {
			retPromise.push(initPromises[i]);
		}
	}
	return retPromise;
}
exports.all = pasyncAll;

let waiter = function() {
	var promiseResolve, promiseReject;
	var promiseIsFinished = false;
	var obj = {
		promise: new Promise(function(resolve, reject) {
			promiseResolve = resolve;
			promiseReject = reject;
		}),
		resolve: function(result) {
			if (promiseIsFinished) {
				obj.reset();
			}
			promiseIsFinished = true;
			promiseResolve(result);
			return obj;
		},
		reject: function(err) {
			if (promiseIsFinished) {
				obj.reset();
			}
			promiseIsFinished = true;
			promiseReject(err);
			return obj;
		},
		reset: function() {
			if (promiseIsFinished) {
				obj.promise = new Promise(function(resolve, reject) {
					promiseResolve = resolve;
					promiseReject = reject;
				});
				promiseIsFinished = false;
			}
			return obj;
		}
	};
	obj.promise.catch(() => {});
	return obj;
};
exports.waiter = waiter;

exports.apply = function(fn, ...args) {
	return async function() {
		return await fn(...args);
	}
}

exports.each = wrapParallel(eachOps);
exports.eachSeries = wrapSeries(eachOps);
exports.eachLimit = wrapLimit(eachOps, { opIndexes: [ 0, 2 ], limitIndex: 1 });
exports.map = wrapParallel(mapOps);
exports.mapSeries = wrapSeries(mapOps);
exports.mapLimit = wrapLimit(mapOps, { opIndexes: [ 0, 2 ], limitIndex: 1 });
exports.mapValues = wrapParallel(mapValuesOps);
exports.mapValuesSeries = wrapSeries(mapValuesOps);
exports.mapValuesLimit = wrapLimit(mapValuesOps, { opIndexes: [ 0, 2 ], limitIndex: 1 });
exports.filter = wrapParallel(filterOps);
exports.filterSeries = wrapSeries(filterOps);
exports.reject = wrapParallel(rejectOps);
exports.rejectSeries = wrapSeries(rejectOps);
exports.detect = wrapParallel(detectOps);
exports.detectSeries = wrapSeries(detectOps);
exports.concat = wrapParallel(concatOps);
exports.concatSeries = wrapSeries(concatOps);
exports.parallel = wrapParallel(callOps);
exports.series = wrapSeries(callOps);
exports.parallelLimit = wrapLimit(callOps, { opIndexes: [ 0 ], limitIndex: 1 });
exports.times = wrapParallel(timesOps);
exports.timesSeries = wrapSeries(timesOps);
exports.timesLimit = wrapLimit(timesOps);
exports.applyEach = wrapParallel(applyOps);
exports.applyEachSeries = wrapSeries(applyOps);

exports.reduce = reduceFunc();
exports.reduceRight = reduceFunc(true);
exports.sortBy = sortBy;
exports.some = someFunc();
exports.every = someFunc(true);
exports.whilst = whilstFunc(false, false),
exports.doWhilst = whilstFunc(true, false);
exports.during = whilstFunc(false, false);
exports.doDuring = whilstFunc(true, false);
exports.until = whilstFunc(false, true);
exports.doUntil = whilstFunc(true, true);
exports.forever = forever;
exports.waterfall = waterfall;
exports.compose = compose;

exports.retry = async function(config, task) {
	let times = 5, interval = 0;
	if (typeof config === 'number') {
		times = config;
	} else if (typeof config === 'object') {
		if (config.times) times = config.times;
		if (config.interval) interval = config.interval;
	} else if (typeof config === 'function') {
		task = config;
	}
	let lastError;
	for (let i = 0; i < times; i++) {
		try {
			return await task();
		} catch (err) {
			lastError = err;
		}
		if ((i < times - 1) && (interval > 0)) {
			await pasyncSetTimeout(interval);
		}
	}
	throw lastError;
};

class PasyncQueue {

	constructor(taskFn, concurrency) {
		this.taskFn = taskFn;
		this.concurrency = concurrency;
		this.currentRunning = 0;
		this.taskQueue = [];
		this.hooks = {
			taskError: [],
			saturated: [],
			unsaturated: [],
			drain: []
		}
	}

	async _triggerHook(hookName, hookArgs = []) {
		if (!this.hooks[hookName] || this.hooks[hookName].length === 0) {
			return;
		}
		await exports.eachSeries(this.hooks[hookName], async (hookFn) => {
			await hookFn(...hookArgs);
		});
	}

	_checkRunNext() {
		if (this.currentRunning >= this.concurrency) return;
		if (this.taskQueue.length === 0) return;
		let currentTask = this.taskQueue.shift();
		let doTask = async () => {
			this.currentRunning += 1;
			if (this.currentRunning === this.concurrency) {
				await this._triggerHook('saturated', []);
			}
			try {
				await this.taskFn(currentTask);
			} catch (err) {
				await this._triggerHook('taskError', [ err, currentTask ]);
			}
			if (this.currentRunning === this.concurrency) {
				await this._triggerHook('unsaturated', []);
			}
			this.currentRunning -= 1;
			if (this.currentRunning === 0) {
				await this._triggerHook('drain', []);
			}
		}
		doTask()
			.then(() => {
				tickFn(() => {
					this._checkRunNext();
				});
			})
			.catch((err) => abort(err));
	}

	error(fn) {
		this.hooks.taskError.push(fn);
	}

	saturated(fn) {
		this.hooks.saturated.push(fn);
	}

	unsaturated(fn) {
		this.hooks.unsaturated.push(fn);
	}

	drain(fn) {
		this.hooks.drain.push(fn);
	}

	length() {
		return this.taskQueue.length;
	}

	running() {
		return this.currentRunning;
	}

	idle() {
		return ((this.currentRunning === 0) && (this.taskQueue.length === 0));
	}

	push(task) {
		if (Array.isArray(task)) {
			this.taskQueue.push(...task);
		} else {
			this.taskQueue.push(task);
		}
		this._checkRunNext();
	}

	unshift(task) {
		if (Array.isArray(task)) {
			this.taskQueue.unshift(...task);
		} else {
			this.taskQueue.unshift(task);
		}
		this._checkRunNext();
	}

}
exports.queue = function(taskFn, concurrency) {
	return new PasyncQueue(taskFn, concurrency);
};


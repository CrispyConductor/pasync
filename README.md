# pasync

![Travis CI Status](https://travis-ci.org/crispy1989/pasync.svg?branch=master)

Version of async that uses promises instead of callbacks.  Also includes other asynchronous
promise utilities.

```js
var pasync = require('pasync');

function getUserById(id) {
	return new Promise(...);
}

var userIds = [1, 2, 3, 4, 5, 6];

pasync.mapLimit(userIds, 2, getUserById).then(function(users) {
	// ...
});
```

You can also return values instead of promises from the iterator functions, and these
will be converted into resolved promises.  Exceptions thrown from iterator functions
will be converted into rejected promises.

Additionally, this implements error handling for async functions that don't natively
have error handling, such as `async.filter` .

## Implemented Functions

* each
* eachSeries
* eachLimit
* map
* mapSeries
* mapLimit
* filter
* select
* filterSeries
* selectSeries
* reject
* rejectSeries
* reduce
* inject
* foldl
* reduceRight
* foldr
* detect
* detectSeries
* sortBy
* some
* every
* concat
* concatSeries
* series
* parallel
* parallelLimit
* whilst
* doWhilst
* until
* doUntil
* forever
* waterfall
* compose
* seq
* applyEach
* applyEachSeries
* queue
* priorityQueue
* cargo
* auto
* retry
* apply
* nextTick
* times
* timesSeries
* memoize
* unmemoize
* log
* dir
* constant
* asyncify
* wrapsync
* during
* doDuring

## Neo-Async Functions Implemented

* concatLimit
* mapValues
* mapValuesSeries
* mapValuesLimit
* detectLimit
* everySeries
* everyLimit
* filterLimit
* pick
* pickSeries
* pickLimit
* rejectLimit
* selectLimit
* someSeries
* someLimit
* sortBySeries
* sortByLimit
* transform
* transformSeries
* transformLimit
* timesLimit

## Functions not implemented

* iterator
* noConflict

## Other Utilities

### all([promises])

#### Note
async.all is an alias for async.every. pasync.all is the function described here, not an alias for every.

This is similar to ES6's `Promise.all()`, but with the following differences and enhancements:

* The returned promise has a `push(promise)` method which allows you to add additional promises to
  the pool after instantiation.  The returned promise only resolves once all promises added to it
  have resolved.  It is an error to try to push a new promise after the returned promise has already
  resolved.
* Promises *may* be pushed after the returned promises has rejected.  In this case, newly pushed
  promises are silently ignored.
* The order of the result array is guaranteed to be the order that promises were added.
* The `[promise1, promise2, ...]` parameter is optional.  If not passed (or is an empty array),
  the returned promise will *not* resolve immediately; instead it will wait for at least one
  promise to be pushed.

Use it like this:

```js
var p = pasync.all([ promise1, promise2 ]);
p.then(/* handlers */);
// later ...
p.push(promise3);
p.push(promise4);
```

### abort(err)

This is intended to be used as a last-ditch error handler for promises.  Using
promises, if the last rejection handler in a promise throws an exception, it is
silently ignored.  Calling `abort(err)` will throw `err` as an exception in the
global scope, calling the process's `uncaughtException` listeners or exiting with
the exception by default.  Use it like this:

```js
getUser(nonexistent_id).then(function(user) {
	// do something with user
}).catch(function(err) {
	// Note the (obvious) errors in the rejection handlers; by default, this will be silently ignored
	cunsil.lug(err);
}).catch(pasync.abort);	// This will catch the undefined variable error and throw it globally
```

## Contributors

- crispy1989
- crowelch


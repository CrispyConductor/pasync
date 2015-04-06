# pasync

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
* log
* dir
* noConflict

## Other Utilities

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

# pasync

Version of async that uses promises instead of callbacks.

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

### Collections
x* each
x* eachSeries
x* eachLimit
x* map
x* mapSeries
x* mapLimit
x* filter
* select --Alias for filter?
x* filterSeries
* selectSeries --Alias for filterSeries?
x* reject
x* rejectSeries
x* reduce
* inject --where?
* foldl
x* reduceRight
* foldr
x* detect
x* detectSeries
x* sortBy
x* some
x* every
x* concat
x* concatSeries

### Control Flow
x* series
x* parallel
x* parallelLimit
x* whilst
x* doWhilst
x* until
x* doUntil
x* forever
x* waterfall

## //TODO
### Collections
* compose
* seq
* applyEach
* applyEachSeries
* queue
* priorityQueue
* cargo
* auto
* retry
* iterator
* apply
* nextTick
* times
* timesSeries

### Utils
* memoize
* unmemoize
* log
* dir
* noConflict

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
* queue

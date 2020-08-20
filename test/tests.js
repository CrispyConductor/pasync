/*jshint -W030 */

var expect = require('chai').expect;
var pasync = require('../lib/index');

function setTimeoutPromise(t) {
	return new Promise(function(resolve) {
		setTimeout(resolve, t);
	});
}

describe('pasync', function() {

	it('each with promises', function(done) {
		var arr = [1, 2, 3];
		var res = [];
		pasync.each(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					res.push(el);
					resolve();
				});
			});
		}).then(function() {
			expect(res).to.contain(1);
			expect(res).to.contain(2);
			expect(res).to.contain(3);
			expect(res).to.have.length(3);
			done();
		}).catch(done);
	});

	it('each with values', function(done) {
		var arr = [1, 2, 3];
		var res = [];
		pasync.each(arr, function(el) {
			res.push(el);
		}).then(function() {
			expect(res).to.contain(1);
			expect(res).to.contain(2);
			expect(res).to.contain(3);
			expect(res).to.have.length(3);
			done();
		}).catch(done);
	});

	it('each with error', function(done) {
		var arr = [1, 2, 3];
		pasync.each(arr, function() {
			return new Promise(function(resolve, reject) {
				setImmediate(function() {
					reject(123);
				});
			});
		}).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('each with undefined error', function(done) {
		var arr = [1, 2, 3];
		pasync.each(arr, function() {
			return new Promise(function(resolve, reject) {
				setImmediate(function() {
					reject();
				});
			});
		}).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.not.exist;
			done();
		}).catch(done);
	});

	it('each with throw', function(done) {
		var arr = [1, 2, 3];
		pasync.each(arr, function() {
			throw 123;
		}).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('eachSeries', function(done) {
		var arr = [1, 2, 3];
		var res = [];
		pasync.eachSeries(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					res.push(el);
					resolve();
				});
			});
		}).then(function() {
			expect(res).to.contain(1);
			expect(res).to.contain(2);
			expect(res).to.contain(3);
			expect(res).to.have.length(3);
			done();
		}).catch(done);
	});

	it('eachLimit', function(done) {
		var arr = [1, 2, 3];
		var res = [];
		pasync.eachLimit(arr, 2, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					res.push(el);
					resolve();
				});
			});
		}).then(function() {
			expect(res).to.contain(1);
			expect(res).to.contain(2);
			expect(res).to.contain(3);
			expect(res).to.have.length(3);
			done();
		}).catch(done);
	});

	it('map with promises', function(done) {
		var arr = [1, 2, 3];
		pasync.map(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el + 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3, 4]);
			done();
		}).catch(done);
	});

	it('map with values', function(done) {
		var arr = [1, 2, 3];
		pasync.map(arr, function(el) {
			return el + 1;
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3, 4]);
			done();
		}).catch(done);
	});

	it('mapSeries', function(done) {
		var arr = [1, 2, 3];
		pasync.mapSeries(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el + 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3, 4]);
			done();
		}).catch(done);
	});

	it('mapLimit', function(done) {
		var arr = [1, 2, 3];
		pasync.mapLimit(arr, 2, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el + 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3, 4]);
			done();
		}).catch(done);
	});

	it('filter', function(done) {
		var arr = [1, 2, 3];
		pasync.filter(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el > 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3]);
			done();
		}).catch(done);
	});

	it('filter with error', function(done) {
		var arr = [1, 2, 3];
		pasync.filter(arr, function() {
			return new Promise(function(resolve, reject) {
				setImmediate(function() {
					reject(123);
				});
			});
		}).then(function(res) {
			done(new Error('Should not succeed'));
		}).catch(function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('filterSeries', function(done) {
		var arr = [1, 2, 3];
		pasync.filterSeries(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el > 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([2, 3]);
			done();
		}).catch(done);
	});

	it('reject', function(done) {
		var arr = [1, 2, 3];
		pasync.reject(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el > 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([1]);
			done();
		}).catch(done);
	});

	it('rejectSeries', function(done) {
		var arr = [1, 2, 3];
		pasync.rejectSeries(arr, function(el) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(el > 1);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([1]);
			done();
		}).catch(done);
	});

	it('reduce', function(done) {
		var arr = [1, 2, 3];
		pasync.reduce(arr, 0, function(memo, item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(memo + item);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(6);
			done();
		}).catch(done);
	});

	it('reduce with error', function(done) {
		var arr = [1, 2, 3];
		pasync.reduce(arr, 0, function(memo, item) {
			return new Promise(function(resolve, reject) {
				setImmediate(function() {
					reject(123);
				});
			});
		}).then(function(res) {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('reduceRight', function(done) {
		var arr = [1, 2, 3];
		pasync.reduceRight(arr, 0, function(memo, item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(memo + item);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(6);
			done();
		}).catch(done);
	});

	it('detect', function(done) {
		var arr = [1, 2, 3];
		pasync.detect(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item === 2);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(2);
			done();
		}).catch(done);
	});

	it('detectSeries', function(done) {
		var arr = [1, 2, 3];
		pasync.detectSeries(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item === 2);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(2);
			done();
		}).catch(done);
	});

	it('sortBy', function(done) {
		var arr = [3, 5, 2, 1, 4];
		pasync.sortBy(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([1, 2, 3, 4, 5]);
			done();
		}).catch(done);
	});

	it('some', function(done) {
		var arr = [1, 2, 3];
		pasync.some(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item === 2);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(true);
			done();
		}).catch(done);
	});

	it('every', function(done) {
		var arr = [1, 2, 3];
		pasync.every(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item === 2);
				});
			});
		}).then(function(res) {
			expect(res).to.equal(false);
			done();
		}).catch(done);
	});

	it('concat', function(done) {
		var arr = [[1, 2], [3, 4]];
		pasync.concat(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([1, 2, 3, 4]);
			done();
		}).catch(done);
	});

	it('concatSeries', function(done) {
		var arr = [[1, 2], [3, 4]];
		pasync.concatSeries(arr, function(item) {
			return new Promise(function(resolve) {
				setImmediate(function() {
					resolve(item);
				});
			});
		}).then(function(res) {
			expect(res).to.deep.equal([1, 2, 3, 4]);
			done();
		}).catch(done);
	});

	it('series', function(done) {
		var a = false, b = false;
		var funcs = [
			function() {
				return new Promise(function(resolve) {
					a = true;
					resolve(1);
				});
			},
			function() {
				return new Promise(function(resolve) {
					b = true;
					resolve(2);
				});
			}
		];
		pasync.series(funcs).then(function(result) {
			expect(result[0]).to.equal(1);
			expect(result[1]).to.equal(2);
			expect(a).to.be.true;
			expect(b).to.be.true;
			done();
		}).catch(done);
	});

	it('series with error', function(done) {
		var a = false, b = false;
		var funcs = [
			function() {
				return new Promise(function(resolve) {
					a = true;
					resolve();
				});
			},
			function() {
				return new Promise(function(resolve, reject) {
					b = true;
					reject(123);
				});
			}
		];
		pasync.series(funcs).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('series with undefined error', function(done) {
		var a = false, b = false;
		var funcs = [
			function() {
				return new Promise(function(resolve) {
					a = true;
					resolve();
				});
			},
			function() {
				return new Promise(function(resolve, reject) {
					b = true;
					reject();
				});
			}
		];
		pasync.series(funcs).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.not.exist;
			done();
		}).catch(done);
	});

	it('parallel', function(done) {
		var a = false, b = false;
		var funcs = [
			function() {
				return new Promise(function(resolve) {
					a = true;
					resolve();
				});
			},
			function() {
				return new Promise(function(resolve) {
					b = true;
					resolve();
				});
			}
		];
		pasync.parallel(funcs).then(function() {
			expect(a).to.be.true;
			expect(b).to.be.true;
			done();
		}).catch(done);
	});

	it('parallelLimit', function(done) {
		var a = false, b = false;
		var funcs = [
			function() {
				return new Promise(function(resolve) {
					a = true;
					resolve(1);
				});
			},
			function() {
				return new Promise(function(resolve) {
					b = true;
					resolve(2);
				});
			}
		];
		pasync.parallelLimit(funcs, 1).then(function(result) {
			expect(result[0]).to.equal(1);
			expect(result[1]).to.equal(2);
			expect(a).to.be.true;
			expect(b).to.be.true;
			done();
		}).catch(done);
	});

	it('whilst', function(done) {
		var ctr = 0;
		pasync.whilst(function() {
			return ctr < 10;
		}, function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('doWhilst', function(done) {
		var ctr = 0;
		pasync.doWhilst(function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}, function() {
			return ctr < 10;
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('during', function(done) {
		var ctr = 0;
		pasync.during(function() {
			return ctr < 10;
		}, function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('doDuring', function(done) {
		var ctr = 0;
		pasync.doDuring(function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}, function() {
			return ctr < 10;
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('until', function(done) {
		var ctr = 0;
		pasync.until(function() {
			return ctr === 10;
		}, function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('doUntil', function(done) {
		var ctr = 0;
		pasync.doUntil(function() {
			return new Promise(function(resolve) {
				ctr++;
				resolve();
			});
		}, function() {
			return ctr === 10;
		}).then(function() {
			expect(ctr).to.equal(10);
			done();
		}).catch(done);
	});

	it('forever', function(done) {
		var ctr = 0;
		pasync.forever(function() {
			return new Promise(function(resolve, reject) {
				ctr++;
				if(ctr > 10) {
					reject(123);
				} else {
					resolve();
				}
			});
		}).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			expect(ctr).to.equal(11);
			done();
		}).catch(done);
	});

	it('waterfall', function(done) {
		pasync.waterfall([
			function() {
				return 1;
			}, function(res) {
				return res + 5;
			}, function(res) {
				return new Promise(function(resolve, reject) {
					resolve(res + 11);
				});
			}
		]).then(function(res) {
			expect(res).to.equal(17);
			done();
		}).catch(done);
	});

	it('compose', function(done) {
		var thisTest = {};
		function mul2(n) {
			return Promise.resolve(n * 2);
		}
		function mul3(n) {
			return Promise.resolve(n * 3);
		}
		function mul4(n) {
			return Promise.resolve(n * 4);
		}
		var composition = pasync.compose(mul2, mul3, mul4);
		composition.call(thisTest, 2).then(function(result) {
			expect(result).to.equal(48);
			done();
		}).catch(done);
	});

	it('compose with error', function(done) {
		function mul2(n) {
			return Promise.resolve(n * 2);
		}
		function mul3(n) {
			return Promise.reject(123);
		}
		function mul4(n) {
			return Promise.resolve(n * 4);
		}
		var composition = pasync.compose(mul2, mul3, mul4);
		composition(2).then(function(result) {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('applyEach', function(done) {
		var resultArray = [];
		function addStuff1(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		function addStuff2(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		function addStuff3(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		pasync.applyEach([
			addStuff1,
			addStuff2,
			addStuff3
		], 4, 5).then(function() {
			expect(resultArray).to.deep.equal([4, 5, 4, 5, 4, 5]);
			done();
		}).catch(done);
	});

	it('applyEach with error', function(done) {
		var resultArray = [];
		function addStuff1(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		function addStuff2(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.reject(123);
		}
		function addStuff3(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		pasync.applyEach([
			addStuff1,
			addStuff2,
			addStuff3
		], 4, 5).then(function() {
			done(new Error('Should not succeed'));
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('applyEachSeries', function(done) {
		var resultArray = [];
		function addStuff1(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		function addStuff2(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		function addStuff3(a, b) {
			resultArray.push(a);
			resultArray.push(b);
			return Promise.resolve();
		}
		pasync.applyEachSeries([
			addStuff1,
			addStuff2,
			addStuff3
		], 4, 5).then(function() {
			expect(resultArray).to.deep.equal([4, 5, 4, 5, 4, 5]);
			done();
		}).catch(done);
	});

	it('retry', function(done) {
		var responseArray = [];
		var retry = pasync.retry(3, function() {
			responseArray.push('a');
			responseArray.push('b');
			responseArray.push('c');
			return Promise.resolve();
		}).then(function() {
			expect(responseArray).to.deep.equal(['a', 'b', 'c']);
			done();
		}).catch(done);
	});

	it('retry with no times param', function(done) {
		var responseArray = [];
		var retry = pasync.retry(function() {
			responseArray.push('a');
			responseArray.push('b');
			responseArray.push('c');
			return Promise.resolve();
		}).then(function() {
			expect(responseArray).to.deep.equal(['a', 'b', 'c']);
			done();
		}).catch(done);
	});

	it('retry with object param', function(done) {
		var responseArray = [];
		var retry = pasync.retry({times: 12, interval: 8}, function() {
			responseArray.push('a');
			responseArray.push('b');
			responseArray.push('c');
			return Promise.resolve();
		}).then(function() {
			expect(responseArray).to.deep.equal(['a', 'b', 'c']);
			done();
		}).catch(done);
	});

	it('retry with error', function(done) {
		var retryCount = 0;
		var retry = pasync.retry(function() {
			retryCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			expect(retryCount).to.equal(5);
			done();
		}).catch(done);
	});

	it('retry with error default', function(done) {
		var retryCount = 0;
		var retry = pasync.retry(function() {
			retryCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			expect(retryCount).to.equal(5);
			done();
		}).catch(done);
	});

	it('retry with error and object param', function(done) {
		var retryCount = 0;
		var retry = pasync.retry({times: 12, interval: 8}, function() {
			retryCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			expect(retryCount).to.equal(12);
			done();
		}).catch(done);
	});

	it('retry with error and just task', function(done) {
		var retryCount = 0;
		var retry = pasync.retry(function() {
			retryCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			expect(retryCount).to.equal(5);
			done();
		}).catch(done);
	});

	it('retry with error and object as first param', function(done) {
		var retryCount = 0;
		var retry = pasync.retry({times: 4, interval: 7}, function() {
			retryCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			expect(retryCount).to.equal(4);
			done();
		}).catch(done);
	});

	it('apply', function(done) {
	var arr = [0, 1, 2];
		var responseArray = [];
		pasync.parallel([
			pasync.apply(function(myArr) {
				myArr.forEach(function(item) {
					responseArray.push(++item);
				});
			}, arr)
		]).then(function() {
			expect(responseArray).to.contain(1);
			expect(responseArray).to.contain(2);
			expect(responseArray).to.contain(3);
			done();
		}).catch(done);
	});

	it('nextTick', function(done) {
		var resultArray = [];
		new Promise(function(resolve) {
			pasync.nextTick()
				.then(function() {
					resultArray.push(1);
					resolve();
				});
		}).then(function() {
			resultArray.push(2);
			expect(resultArray).to.deep.equal([1, 2]);
			done();
		}).catch(done);
	});

	it('nextTick chaining', function(done) {
		var resultArray = [];
		resultArray.push(1);
		Promise.resolve().then(function() {
			resultArray.push(2);
		}).then(pasync.nextTick).then(function() {
			expect(resultArray).to.deep.equal([1, 2]);
			done();
		}).catch(done);
	});

	it('times', function(done) {
		var timesCount = 0;
		var timesTest = 2;
		pasync.times(8, function(n, next) {
			timesCount++;
			timesTest = timesTest * 2;
			return Promise.resolve();
		}).then(function() {
			expect(timesCount).to.equal(8);
			expect(timesTest).to.equal(512);
			done();
		}).catch(done);
	});

	it('times with error', function(done) {
		var timesCount = 0;
		pasync.times(8, function(n, next) {
			timesCount++;
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(timesCount).to.equal(8);
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('times with mapped result', function(done) {
		var timesCount = 0;
		pasync.times(5, function(n, next) {
			return Promise.resolve(n);
		}).then(function(result) {
			expect(result).to.deep.equal([ 0, 1, 2, 3, 4 ]);
			done();
		}).catch(done);
	});

	it('timesSeries', function(done) {
		var timesCount = 0;
		var timesTest = 2;
		pasync.timesSeries(17, function(n, next) {
			timesCount++;
			timesTest = timesTest * 2;
			return Promise.resolve();
		}).then(function() {
			expect(timesCount).to.equal(17);
			expect(timesTest).to.equal(262144);
			done();
		}).catch(done);
	});

	it('timesSeries with error', function(done) {
		pasync.timesSeries(8, function(n, next) {
			return Promise.reject(123);
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('timesSeries with mapped result', function(done) {
		var timesCount = 0;
		pasync.timesSeries(5, function(n, next) {
			return Promise.resolve(n);
		}).then(function(result) {
			expect(result).to.deep.equal([ 0, 1, 2, 3, 4 ]);
			done();
		}).catch(done);
	});

	it('asyncify', function(done) {
		var xyz = pasync.asyncify(function(x, y, z) {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
			expect(z).to.equal(3);
		});

		xyz(1, 2, 3).then(function() {
			done();
		}).catch(done);
	});

	it('asyncify with error', function(done) {
		var xyz = pasync.asyncify(function(x, y, z) {
			throw new Error('err err!');
		});

		xyz(1, 2, 3).then(function() {

		}, function(err) {
			expect(err).to.exist;
			done();
		}).catch(done);
	});

	it('wrapSync', function(done) {
		var xyz = pasync.wrapSync(function(x, y, z) {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
			expect(z).to.equal(3);
		});

		xyz(1, 2, 3).then(function() {
			done();
		}).catch(done);
	});

	describe('Utilities', function() {

		it('abort', function(done) {
			// fudge around with uncaught exception listeners ...
			var oldListeners = process.listeners('uncaughtException').slice(0);
			oldListeners.forEach(function(listener) {
				process.removeListener('uncaughtException', listener);
			});
			var newListener = function(exception) {
				process.removeListener('uncaughtException', newListener);
				oldListeners.forEach(function(listener) {
					process.on('uncaughtException', listener);
				});
				expect(exception).to.equal(123);
				done();
			};
			process.on('uncaughtException', newListener);

			// Do test
			new Promise(function(resolve) {
				setTimeout(resolve, 5);
			}).then(function() {
				throw 123;
			}).catch(pasync.abort);
		});

		it('setTimeout', function(done) {
			pasync.setTimeout(50).then(done);
		});

		it('setImmediate', function(done) {
			pasync.setImmediate().then(done);
		});

		describe('all', function() {

			it('result order', function(done) {
				var numResolved = 0;
				var p1 = new Promise(function(resolve) {
					setTimeout(function() {
						numResolved++;
						resolve(1);
					}, 2);
				});
				var p2 = new Promise(function(resolve) {
					setTimeout(function() {
						numResolved++;
						resolve(2);
					}, 6);
				});
				var p3 = new Promise(function(resolve) {
					setTimeout(function() {
						numResolved++;
						resolve(3);
					}, 4);
				});
				pasync.all([ p1, p2, p3 ]).then(function(results) {
					expect(results).to.deep.equal([ 1, 2, 3 ]);
					expect(numResolved).to.equal(3);
					done();
				}).catch(done);
			});

			it('pushing additional promises', function(done) {
				var numResolved = 0;
				var p1 = new Promise(function(resolve) {
					setTimeout(function() {
						numResolved++;
						resolve(1);
					}, 2);
				});
				var p2 = new Promise(function(resolve) {
					setTimeout(function() {
						numResolved++;
						resolve(2);
					}, 16);
				});
				var allPromise = pasync.all([ p1, p2 ]);
				setTimeout(function() {
					var p3 = new Promise(function(resolve) {
						setTimeout(function() {
							numResolved++;
							resolve(3);
						}, 18);
					});
					allPromise.push(p3);
				}, 10);
				allPromise.then(function(results) {
					expect(results).to.deep.equal([ 1, 2, 3 ]);
					expect(numResolved).to.equal(3);
					done();
				}).catch(done);
			});

			it('not resolved with passed no promises', function(done) {
				var allPromise = pasync.all();
				allPromise.then(function(results) {
					expect(results).to.deep.equal([ 1 ]);
					done();
				}).catch(done);
				setTimeout(function() {
					var p1 = new Promise(function(resolve) {
						setTimeout(function() {
							resolve(1);
						}, 2);
					});
					allPromise.push(p1);
				}, 10);
			});

			it('errors', function(done) {
				var p1 = new Promise(function(resolve) {
					setTimeout(function() {
						resolve(1);
					}, 2);
				});
				var p2 = new Promise(function(resolve) {
					setTimeout(function() {
						resolve(2);
					}, 6);
				});
				var p3 = new Promise(function(resolve, reject) {
					setTimeout(function() {
						reject('err');
					}, 4);
				});
				pasync.all([ p1, p2, p3 ]).then(function() {
					throw new Error('should not reach');
				}).catch(function(err) {
					expect(err).to.equal('err');
					done();
				});
			});
		});

		describe('waiter', function() {

			it('should resolve all listeners when resolve is called', function() {
				var waiter = pasync.waiter();
				var results = [];
				var errors = [];
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.resolve('foo');
				return setTimeoutPromise(10)
					.then(function() {
						waiter.promise.then(function(result) {
							results.push(result);
						}, function(err) {
							errors.push(err);
						});
						return setTimeoutPromise(10);
					})
					.then(function() {
						expect(results).to.deep.equal([ 'foo', 'foo', 'foo' ]);
						expect(errors).to.deep.equal([]);
					});
			});

			it('should reject all listeners when reject is called', function() {
				var waiter = pasync.waiter();
				var results = [];
				var errors = [];
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.reject('foo');
				return setTimeoutPromise(10)
					.then(function() {
						waiter.promise.then(function(result) {
							results.push(result);
						}, function(err) {
							errors.push(err);
						});
						return setTimeoutPromise(10);
					})
					.then(function() {
						expect(results).to.deep.equal([]);
						expect(errors).to.deep.equal([ 'foo', 'foo', 'foo' ]);
					});
			});

			it('should not reset if promise has not yet finished', function() {
				var waiter = pasync.waiter();
				var results = [];
				var errors = [];
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.reset();
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.resolve('foo');
				return setTimeoutPromise(10)
					.then(function() {
						waiter.promise.then(function(result) {
							results.push(result);
						}, function(err) {
							errors.push(err);
						});
						return setTimeoutPromise(10);
					})
					.then(function() {
						expect(results).to.deep.equal([ 'foo', 'foo', 'foo' ]);
						expect(errors).to.deep.equal([]);
					});
			});

			it('should automatically reset if already finished', function() {
				var waiter = pasync.waiter();
				var results = [];
				var errors = [];
				waiter.resolve('foo');
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.reject('bar');
				waiter.promise.then(function(result) {
					results.push(result);
				}, function(err) {
					errors.push(err);
				});
				waiter.resolve('baz');
				return setTimeoutPromise(10)
					.then(function() {
						waiter.promise.then(function(result) {
							results.push(result);
						}, function(err) {
							errors.push(err);
						});
						return setTimeoutPromise(10);
					})
					.then(function() {
						expect(results).to.deep.equal([ 'foo', 'baz' ]);
						expect(errors).to.deep.equal([ 'bar' ]);
					});
			});

		});

	});
});

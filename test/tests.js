/*jshint -W030 */

var expect = require('chai').expect;
var pasync = require('../lib/index');
var Promise = require('es6-promise').Promise;

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
			expect(this).to.equal(thisTest);
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

	it('seq', function(done) {
		var thisTest = {};
		function mul2(n) {
			return Promise.resolve(n * 2);
		}
		function mul3(n) {
			expect(this).to.equal(thisTest);
			return Promise.resolve(n * 3);
		}
		function mul4(n) {
			return Promise.resolve(n * 4);
		}
		var composition = pasync.seq(mul2, mul3, mul4);
		composition.call(thisTest, 2).then(function(result) {
			expect(result).to.equal(48);
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

	it('queue', function(done) {
		var responseQueue = [];
		var queue = pasync.queue(function(task) {
			return new Promise(function(resolve, reject) {
				responseQueue.push(task * 2);
				resolve();
			});
		}, 2);

		queue.unshift(1).catch(done);
		queue.push([2, 3, 4, 5]).catch(done);

		queue.drain = function() {
			expect(responseQueue).to.deep.equal([2, 4, 6, 8, 10]);
			done();
		};
	});

	it('queue with error', function(done) {
		var responseQueue = [];
		var queue = pasync.queue(function(task) {
			return new Promise(function(resolve, reject) {
				if(task === 4) {
					reject(123);
				} else {
					responseQueue.push(task * 2);
					resolve();
				}
			});
		}, 2);

		queue.unshift(1).catch(done);
		queue.push([2, 3]).catch(done);
		queue.push(4).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
		}).catch(done);
		queue.push(5).catch(done);

		queue.drain = function() {
			expect(responseQueue).to.deep.equal([2, 4, 6, 10]);
			done();
		};
	});

	it('priorityQueue', function(done) {
		var responseQueue = [];
		var priorityQueue = pasync.priorityQueue(function(task) {
			return new Promise(function(resolve, reject) {
				responseQueue.push(task * 2);
				resolve();
			});
		}, 2);

		priorityQueue.push(1, 3).catch(done);
		priorityQueue.push([2, 3, 4, 5], 1).catch(done);

		priorityQueue.drain = function() {
			expect(responseQueue).to.deep.equal([4, 6, 8, 10, 2]);
			done();
		};
	});


	it('priorityQueue with error', function(done) {
		var responseQueue = [];
		var priorityQueue = pasync.priorityQueue(function(task) {
			return new Promise(function(resolve, reject) {
				if(task === 4) {
					reject(123);
				} else {
					responseQueue.push(task * 2);
					resolve();
				}
			});
		}, 2);

		priorityQueue.push([2, 3]).catch(done);
		priorityQueue.push(4).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
		}).catch(done);
		priorityQueue.push(5).catch(done);

		priorityQueue.drain = function() {
			expect(responseQueue).to.deep.equal([4, 6, 10]);
			done();
		};
	});

	it('cargo', function(done) {
		var responseArray = [];
		var cargo = pasync.cargo(function(tasks) {
			tasks.forEach(function(task) {
				responseArray.push(task * 12);
			});
			return Promise.resolve();
		}, 5);

		cargo.push([1, 2, 3, 4, 5]).catch(done);
		cargo.drain = function() {
			expect(responseArray).to.deep.equal([12, 24, 36, 48, 60]);
			done();
		};
	});

	it('cargo with error', function(done) {
		var responseArray = [];
		var cargo = pasync.cargo(function(tasks) {
			return new Promise(function(resolve, reject) {
				var isError = false;
				tasks.forEach(function(task) {
					if(task === 3) {
						isError = true;
					} else {
						responseArray.push(task * 12);
					}
				});
				if(isError) {
					reject(123);
				} else {
					resolve();
				}
			});
		}, 2);

		cargo.push([1, 2, 4, 5]).catch(done);
		cargo.push(3).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('auto', function(done) {
		var responseArray = [];
		var auto = pasync.auto({
			get_data: function() {
				responseArray.push(2);
				return Promise.resolve(2);
			},
			da_data: ['get_data', function(results) {
				var tempResult = results.get_data * 2;
				responseArray.push(tempResult);
				return Promise.resolve(tempResult);
			}],
			get_more_data: ['get_data', 'da_data', function(results) {
				var tempResult = results.da_data * 2;
				responseArray.push(tempResult);
				return Promise.resolve(tempResult);
			}]
		}).then(function(resultObject) {
			expect(responseArray).to.deep.equal([2, 4, 8]);
			done();
		}).catch(done);
	});

	it('auto with value', function(done) {
		var responseArray = [];
		var auto = pasync.auto({
			get_data: function() {
				responseArray.push(2);
				return 2;
			},
			da_data: ['get_data', function(results) {
				var tempResult = results.get_data * 2;
				responseArray.push(tempResult);
				return Promise.resolve(tempResult);
			}],
			get_more_data: ['get_data', 'da_data', function(results) {
				var tempResult = results.da_data * 2;
				responseArray.push(tempResult);
				return Promise.resolve(tempResult);
			}]
		}).then(function(resultObject) {
			expect(responseArray).to.deep.equal([2, 4, 8]);
			done();
		}).catch(done);
	});

	it('auto with error', function(done) {
		var auto = pasync.auto({
			fail_me: function() {
				return Promise.reject(123);
			}
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
			done();
		}).catch(done);
	});

	it('auto with throwing error', function(done) {
		var auto = pasync.auto({
			fail_me: function() {
				throw(123);
			}
		}).then(function() {
			throw new Error('should not reach');
		}, function(err) {
			expect(err).to.equal(123);
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
			pasync.nextTick(resolve);
			resultArray.push(1);
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

	it('memoize', function(done) {
		var responseArray = [];
		var memoCount = 0;
		var myFunc = function(up, down, no) {
			memoCount++;
			return Promise.resolve(up * down * no);
		};
		var myMemo = pasync.memoize(myFunc);
		myMemo(2, 4, 3).then(function(result) {
			responseArray.push(result);
			expect(result).to.equal(24);
		}).then(function() {
			myMemo(0, 4, 3).then(function(result) {
				responseArray.push(result);
				expect(result).to.equal(0);
			}).then(function() {
				myMemo(2, 4, 3).then(function(result) {
					responseArray.push(result);
					expect(result).to.equal(24);
				}).then(function() {
					expect(responseArray).to.contain(24);
					expect(responseArray).to.contain(0);
					expect(Object.keys(myMemo.memo).length).to.equal(2);
					expect(memoCount).to.equal(2);
					done();
				}).catch(done);
			});
		});
	});

	it('memoize with hasher', function(done) {
		var responseArray = [];
		var memoCount = 0;
		var hasher = function() {
			var hashed = 1;
			var args = Array.prototype.slice.call(arguments, 0);
			args.forEach(function(arg) {
				hashed *= arg;
			});
			return hashed;
		};
		var myFunc = function(up, down, no) {
			memoCount++;
			return Promise.resolve(up * down * no);
		};
		var myMemo = pasync.memoize(myFunc, hasher);
		myMemo(2, 4, 3).then(function(result) {
			responseArray.push(result);
			expect(result).to.equal(24);
		}).then(function() {
			myMemo(0, 4, 3).then(function(result) {
				responseArray.push(result);
				expect(result).to.equal(0);
			}).then(function() {
				myMemo(2, 4, 3).then(function(result) {
					responseArray.push(result);
					expect(result).to.equal(24);
				}).then(function() {
					expect(responseArray).to.deep.equal([24, 0, 24]);
					expect(responseArray).to.contain(0);
					expect(Object.keys(myMemo.memo).length).to.equal(2);
					expect(memoCount).to.equal(2);
					done();
				}).catch(done);
			});
		});
	});

	it('unmemoize', function(done) {
		var memoCount = 0;
		var responseArray = [];
		var myMemo;
		var myFunc = function(up) {
			memoCount++;
			return Promise.resolve(up * 2);
		};
		myMemo = pasync.memoize(myFunc);
		var noMemo = pasync.unmemoize(myMemo);
		noMemo(2).then(function(result) {
			responseArray.push(result);
		}).then(function() {
			noMemo(2).then(function(result) {
				responseArray.push(result);
			}).then(function() {
				noMemo(12).then(function(result) {
					responseArray.push(result);
				}).then(function(){
					expect(typeof myMemo.unmemoize).to.equal('function');
					expect(Object.keys(myMemo.memo).length).to.equal(0);
					expect(noMemo.memo).to.equal(undefined);
					expect(noMemo.unmemoize).to.equal(undefined);
					expect(memoCount).to.equal(3);
					expect(responseArray).to.deep.equal([4, 4, 24]);
					done();
				}).catch(done);
			});
		});
	});

	it('log', function(done) {
		var logFn = function(arg1, arg2) {
			return Promise.resolve(arg1 * arg2);
			// Logs '6' to the console
		};

		pasync.log(logFn, 2, 3);
		done();
	});

	it('dir', function(done) {
		var dirFn = function(arg1, arg2) {
			var obj = {
				a: arg1,
				b: arg2
			};
			return Promise.resolve(obj);
			// Logs '{a: 2, b: 3}' to the console
		};

		pasync.dir(dirFn, 2, 3);
		done();
	});

	it('constant', function(done) {
		pasync.constant('Pasync rules!').then(function(result) {
			result(function(err, word) {
				expect(word).to.equal('Pasync rules!');
				done();
			});
		}).catch(done);
	});

	it('constant with multiple arguments', function(done) {
		pasync.constant('a', 2, 'c').then(function(result) {
			result(function(err, a, b, c) {
				expect(a).to.equal('a');
				expect(b).to.equal(2);
				expect(c).to.equal('c');
				done();
			});
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
			console.log(err);
			expect(err).to.exist;
			done();
		}).catch(done);
	});

	it('wrapSync', function(done) {
		var xyz = pasync.asyncify(function(x, y, z) {
			expect(x).to.equal(1);
			expect(y).to.equal(2);
			expect(z).to.equal(3);
		});

		xyz(1, 2, 3).then(function() {
			done();
		}).catch(done);
	});

	describe('Neo-Async Improvement of Convenience Support', function() {
		var testObject = {
			notRed: 'red',
			notGreen: 'green',
			notBlue: 'blue'
		};

		var numTestObject = {
			one: 1,
			two: 2,
			three: 3
		};

		it('each with object', function(done) {
			var res = [];
			pasync.each(testObject, function(el) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						res.push(el);
						resolve();
					});
				});
			}).then(function() {
				expect(res).to.contain('red');
				expect(res).to.contain('blue');
				expect(res).to.contain('green');
				expect(res).to.have.length(3);
				done();
			}).catch(done);
		});

		it('each with values', function(done) {
			var res = [];
			pasync.each(numTestObject, function(el) {
				res.push(el);
			}).then(function() {
				expect(res).to.contain(1);
				expect(res).to.contain(2);
				expect(res).to.contain(3);
				expect(res).to.have.length(3);
				done();
			}).catch(done);
		});

		it('eachSeries', function(done) {
			var res = [];
			pasync.eachSeries(testObject, function(el) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						res.push(el);
						resolve();
					});
				});
			}).then(function() {
					expect(res).to.contain('red');
					expect(res).to.contain('blue');
					expect(res).to.contain('green');
					expect(res).to.have.length(3);
				done();
			}).catch(done);
		});

		it('eachLimit', function(done) {
			var res = [];
			pasync.eachLimit(testObject, 2, function(el) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						res.push(el);
						resolve();
					});
				});
			}).then(function() {
						expect(res).to.contain('red');
						expect(res).to.contain('blue');
						expect(res).to.contain('green');
				expect(res).to.have.length(3);
				done();
			}).catch(done);
		});

		it('map with promises', function(done) {
			pasync.map(numTestObject, function(el) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						resolve(el + 1);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal([ 2, 3, 4 ]);
				done();
			}).catch(done);
		});

		it('map with values', function(done) {
			pasync.map(numTestObject, function(el) {
				return el + 1;
			}).then(function(res) {
				expect(res).to.deep.equal([2, 3, 4]);
				done();
			}).catch(done);
		});

		it('mapSeries', function(done) {
			pasync.mapSeries(numTestObject, function(el) {
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
			pasync.mapLimit(numTestObject, 2, function(el) {
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
			pasync.filter(numTestObject, function(el) {
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

		it('filterSeries', function(done) {
			pasync.filterSeries(numTestObject, function(el) {
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
			pasync.reject(numTestObject, function(el) {
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
			pasync.rejectSeries(numTestObject, function(el) {
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
			pasync.reduce(numTestObject, 0, function(memo, item) {
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

		it('reduceRight', function(done) {
			pasync.reduceRight(numTestObject, 0, function(memo, item) {
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
			pasync.detect(numTestObject, function(item) {
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
			pasync.detectSeries(numTestObject, function(item) {
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
			var unorderedNumTestObject = {
				one: 2,
				two: 3,
				three: 1
			};
			pasync.sortBy(unorderedNumTestObject, function(item) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						resolve(item);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal([1, 2, 3]);
				done();
			}).catch(done);
		});

		it('some', function(done) {
			pasync.some(numTestObject, function(item) {
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
			pasync.every(numTestObject, function(item) {
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
			var specialNumTestObject = {
				one: [1, 2],
				four: [3, 4]
			};
			pasync.concat(specialNumTestObject, function(item) {
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
			var specialNumTestObject = {
				one: [1, 2],
				four: [3, 4]
			};
			pasync.concatSeries(specialNumTestObject, function(item) {
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

		it('parallel as Object', function(done) {
			var a = false, b = false;
			var funcs = {
				funcOne: function() {
					return new Promise(function(resolve) {
						a = true;
						resolve(1);
					});
				},
				funcTwo: function() {
					return new Promise(function(resolve) {
						b = true;
						resolve(2);
					});
				}
			};
			pasync.parallel(funcs).then(function(result) {
				expect(result.funcOne).to.equal(1);
				expect(result.funcTwo).to.equal(2);
				expect(a).to.be.true;
				expect(b).to.be.true;
				done();
			}).catch(done);
		});
	});

	describe('Neo-Async features', function() {

		it('concatLimit', function(done) {
			var arr = [[1, 2], [3, 4]];
			pasync.concatLimit(arr, 17, function(item) {
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

		it('mapValues as array', function(done) {
			var arr = [1, 2, 3];
			pasync.mapValues(arr, function(el) {
				return el + 1;
			}).then(function(res) {
				expect(res).to.deep.equal({
					0: 2,
					1: 3,
					2: 4
				});
				done();
			}).catch(done);
		});

		it('mapValues as object', function(done) {
			var arr = {
				hello: 1,
				goodbye: 2,
				dough: 3
			};
			pasync.mapValues(arr, function(el) {
				return el + 1;
			}).then(function(res) {
				expect(res).to.deep.equal({
					hello: 2,
					goodbye: 3,
					dough: 4
				});
				done();
			}).catch(done);
		});

		it('mapValuesSeries as array', function(done) {
			var arr = [1, 2, 3];
			pasync.mapValuesSeries(arr, function(el) {
				return el + 1;
			}).then(function(res) {
				expect(res).to.deep.equal({
					0: 2,
					1: 3,
					2: 4
				});
				done();
			}).catch(done);
		});

		it('mapValuesSeries as object', function(done) {
			var arr = {
				hello: 1,
				goodbye: 2,
				dough: 3
			};
			pasync.mapValuesSeries(arr, function(el) {
				return el + 1;
			}).then(function(res) {
				expect(res).to.deep.equal({
					hello: 2,
					goodbye: 3,
					dough: 4
				});
				done();
			}).catch(done);
		});

		it('mapValuesLimit', function(done) {
			var arr = {
				hello: 1,
				goodbye: 2,
				dough: 3
			};
			pasync.mapValuesLimit(arr, 2, function(el) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						resolve(el + 1);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal({
					hello: 2,
					goodbye: 3,
					dough: 4
				});
				done();
			}).catch(done);
		});

		it('detectLimit', function(done) {
			var arr = [1, 2, 3];
			pasync.detectLimit(arr, 1, function(item) {
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

		it('everySeries', function(done) {
			var arr = [1, 2, 3];
			pasync.everySeries(arr, function(item) {
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

		it('everyLimit', function(done) {
			var arr = [1, 2, 3];
			pasync.everyLimit(arr, 2, function(item) {
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

		it('filterLimit', function(done) {
			var arr = [1, 2, 3];
			pasync.filterLimit(arr, 2, function(el) {
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

		it('pick with array', function(done) {
			var arr = [1, 3, 2, 4];
			var responseArray = [];
			pasync.pick(arr, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal([1, 3]);
				expect(responseArray).to.deep.equal([1, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('pick with object', function(done) {
			var arr = {
				a: 4,
				b: 3,
				c: 2
			};
			var responseArray = [];
			pasync.pick(arr, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal({
					b: 3
				});
				expect(responseArray).to.deep.equal([4, 3, 2]);
				done();
			}).catch(done);
		});

		it('pickSeries with array', function(done) {
			var arr = [1, 3, 2, 4];
			var responseArray = [];
			pasync.pickSeries(arr, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal([1, 3]);
				expect(responseArray).to.deep.equal([1, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('pickSeries with object', function(done) {
			var arr = {
				a: 4,
				b: 3,
				c: 2
			};
			var responseArray = [];
			pasync.pickSeries(arr, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal({
					b: 3
				});
				expect(responseArray).to.deep.equal([4, 3, 2]);
				done();
			}).catch(done);
		});

		it('pickLimit with array', function(done) {
			var responseArray = [];
			var arr = [1, 5, 3, 2, 4];
			pasync.pickLimit(arr, 2, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal([1, 5, 3]);
				expect(responseArray).to.deep.equal([1, 5, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('pickLimit with object', function(done) {
			var responseArray = [];
			var arr = {
				a: 1,
				b: 5,
				c: 3,
				d: 2,
				e: 4
			};
			pasync.pickLimit(arr, 2, function(num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						responseArray.push(num);
						resolve(num % 2);
					});
				});
			}).then(function(res) {
				expect(res).to.deep.equal({
					a: 1,
					b: 5,
					c: 3
				});
				expect(responseArray).to.deep.equal([1, 5, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('rejectLimit', function(done) {
			var arr = [1, 2, 3];
			pasync.rejectLimit(arr, 1, function(el) {
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

		it('someSeries', function(done) {
			var arr = [1, 2, 3];
			pasync.someSeries(arr, function(item) {
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

		it('someLimit', function(done) {
			var arr = [1, 2, 3];
			pasync.someLimit(arr, 2, function(item) {
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

		it('sortBySeries', function(done) {
			var arr = [3, 5, 2, 1, 4];
			pasync.sortBySeries(arr, function(item) {
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

		it('sortByLimit', function(done) {
			var arr = [3, 5, 2, 1, 4];
			pasync.sortByLimit(arr, 3, function(item) {
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

		it('transform', function(done) {
			var arr = [1, 5, 3, 2, 4];
			var responseArray = [];
			pasync.transform(arr, function(memo, num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						if(num % 2 === 1) {
							if(Array.isArray(memo)) {
								memo.push(num);
							}
						}
						responseArray.push(num);
						resolve();
					});
				});
			}).then(function(res){
				expect(res).to.deep.equal([1, 5, 3]);
				expect(responseArray).to.deep.equal([1, 5, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('transformSeries', function(done) {
			var arr = [1, 3, 2, 4];
			var responseArray = [];
			pasync.transformSeries(arr, function(memo, num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						if(num % 2 === 1) {
							if(Array.isArray(memo)) {
								memo.push(num);
							}
						}
						responseArray.push(num);
						resolve();
					});
				});
			}).then(function(res){
				expect(res).to.deep.equal([1, 3]);
				expect(responseArray).to.deep.equal([1, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('transformLimit', function(done) {
			var arr = [1, 5, 3, 2, 4];
			var responseArray = [];
			pasync.transformLimit(arr, 2, function(memo, num) {
				return new Promise(function(resolve) {
					setImmediate(function() {
						if(num % 2 === 1) {
							if(Array.isArray(memo)) {
								memo.push(num);
							}
						}
						responseArray.push(num);
						resolve();
					});
				});
			}).then(function(res){
				expect(res).to.deep.equal([1, 5, 3]);
				expect(responseArray).to.deep.equal([1, 5, 3, 2, 4]);
				done();
			}).catch(done);
		});

		it('timesLimit', function(done) {
			var timesCount = 0;
			var timesTest = 2;
			pasync.timesLimit(8, 2, function(n, next) {
				timesCount++;
				timesTest = timesTest * 2;
				return Promise.resolve();
			}).then(function() {
				expect(timesCount).to.equal(8);
				expect(timesTest).to.equal(512);
				done();
			}).catch(done);
		});
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
	});
});

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
		pasync.series(funcs).then(function() {
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
		pasync.parallelLimit(funcs, 1).then(function() {
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
});

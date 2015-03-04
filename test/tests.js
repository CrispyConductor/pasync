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

});

const fs = require('fs');
const globalizeCompiler = require('globalize-compiler');
const path = require('path');
const Globalize = require('globalize');
var should = require('should');

var createExpressGlobalize = function() {
	delete require.cache[require.resolve('..')];
	return require('..');
};

describe('initialization', function() {
	it('should initialize without error', function(done) {
		var express_globalize = createExpressGlobalize();

		express_globalize.should.be.an.instanceOf(Object);

		express_globalize.should.have.property('globalizeHandler');
		express_globalize.globalizeHandler.should.be.a.Function;
		express_globalize.should.have.property('getForLocale');
		express_globalize.getForLocale.should.be.a.Function;
		express_globalize.should.have.property('setSupportedLocales');
		express_globalize.setSupportedLocales.should.be.a.Function;

		done();
	});
});

describe('setSupportedLocales', function() {
	it('should fail when nothing is passed in', function(done) {
		var express_globalize = createExpressGlobalize();

		express_globalize.setSupportedLocales.should.throw(TypeError, { message: 'Supported locales must be an array of at least 1 element.' });

		done();
	});

	it('should fail when the array contains no data', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [];

		(function() { express_globalize.setSupportedLocales(locales); }).should.throw(TypeError, { message: 'Supported locales must be an array of at least 1 element.' });

		done();
	});

	it('should fail when the array contains invalid data', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 1, 2, 3 ];

		(function() { express_globalize.setSupportedLocales(locales); }).should.throw(Error);

		done();
	});

	it('should create objects with valid locales', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US', 'fr-FR', 'de-DE' ];

		express_globalize.setSupportedLocales(locales);

		express_globalize.should.have.property('supportedLocales');

		locales.forEach(function(locale) {
			express_globalize.supportedLocales.should.have.property(locale);
			express_globalize.supportedLocales[locale].should.be.an.instanceOf(Object);
			express_globalize.supportedLocales[locale].should.have.property('locale', locale);
			express_globalize.supportedLocales[locale].should.have.property('currencyCode', undefined);
		});

		done();
	});

	it('should create objects with valid locales from an object', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [
			{ localeName: 'en-US' },
			{ localeName: 'fr-FR' },
			{ localeName: 'de-DE' }
		];

		express_globalize.setSupportedLocales(locales);

		express_globalize.should.have.property('supportedLocales');

		locales.forEach(function(locale) {
			express_globalize.supportedLocales.should.have.property(locale.localeName);
			express_globalize.supportedLocales[locale.localeName].should.be.an.instanceOf(Object);
			express_globalize.supportedLocales[locale.localeName].should.have.property('locale', locale.localeName);
			express_globalize.supportedLocales[locale.localeName].should.have.property('currencyCode', undefined);
		});

		done();
	});

	it('should create objects with valid locales and currency codes from an object', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [
			{ localeName: 'en-US', currencyCode: 'USD' },
			{ localeName: 'fr-FR', currencyCode: 'EUR' },
			{ localeName: 'de-DE', currencyCode: 'EUR' }
		];

		express_globalize.setSupportedLocales(locales);

		express_globalize.should.have.property('supportedLocales');

		locales.forEach(function(locale) {
			express_globalize.supportedLocales.should.have.property(locale.localeName);
			express_globalize.supportedLocales[locale.localeName].should.be.an.instanceOf(Object);
			express_globalize.supportedLocales[locale.localeName].should.have.property('locale', locale.localeName);
			express_globalize.supportedLocales[locale.localeName].should.have.property('currencyCode', locale.currencyCode);
		});

		done();
	});
});

describe('getForLocale', function() {
	it('should fail when nothing is passed in', function(done) {
		var express_globalize = createExpressGlobalize();

		var result = express_globalize.getForLocale();
		should.not.exist(result);

		done();
	});

	it('should fail when the locales have not been initialized', function(done) {
		var express_globalize = createExpressGlobalize();

		var result = express_globalize.getForLocale('en-US');
		should.not.exist(result);

		done();
	});

	it('should return an object for a valid locale', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US' ];

		express_globalize.setSupportedLocales(locales);

		var result = express_globalize.getForLocale('en-US');

		result.should.be.an.instanceOf(Object);
		result.should.have.property('locale', 'en-US');
		result.should.have.property('currencyCode', undefined);

		done();
	});

	it('should return nothing for a locale that hasn\'t been loaded', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US' ];

		express_globalize.setSupportedLocales(locales);

		var result = express_globalize.getForLocale('fr-FR');
		should.not.exist(result);

		done();
	});
});

let tester;
const locale = 'en-US';
const bundle = 'en';

const helperTestSuite = () => {
	it('should have the proper functions', function(done) {
		var express_globalize = createExpressGlobalize();

		express_globalize.setSupportedLocales([locale]);

		var result = express_globalize.getForLocale(locale);

		result.should.be.an.instanceOf(Object);
		result.should.have.property('locale', 'en-US');
		result.should.have.property('currencyCode', undefined);

		result.should.have.property('currencyFormatter');
		result.currencyFormatter.should.be.a.Function;
		result.should.have.property('dateFormatter');
		result.dateFormatter.should.be.a.Function;
		result.should.have.property('dateParser');
		result.dateParser.should.be.a.Function;
		result.should.have.property('loadMessages');
		result.loadMessages.should.be.a.Function;
		result.should.have.property('messageFormatter');
		result.messageFormatter.should.be.a.Function;
		result.should.have.property('numberFormatter');
		result.numberFormatter.should.be.a.Function;
		result.should.have.property('numberParser');
		result.numberParser.should.be.a.Function;
		result.should.have.property('pluralGenerator');
		result.pluralGenerator.should.be.a.Function;
		result.should.have.property('relativeTimeFormatter');
		result.relativeTimeFormatter.should.be.a.Function;

		done();
	});

	describe('currencyFormatter', function() {
		it('should throw an error without a currency (or a default)', function(done) {
			tester.currencyFormatter.should.throw();

			done();
		});

		it('should return a valid formatter for a currency', function(done) {
			var cf = tester.currencyFormatter('USD');

			cf.should.be.a.Function;
			cf(5000).should.equal('$5,000.00');

			done();
		});

		it('should return a valid formatter for a currency with options', function(done) {
			var cf = tester.currencyFormatter('USD', { style: "code" });

			cf.should.be.a.Function;
			cf(5000).should.equal('USD 5,000.00');

			done();
		});
	});

	describe('dateFormatter', function() {
		it('should return a valid formatter', function(done) {
			var cf = tester.dateFormatter();

			cf.should.be.a.Function;
			cf(new Date('2020-01-01')).should.equal('12/31/2019');

			done();
		});

		it('should return a valid formatter with options', function(done) {
			var cf = tester.dateFormatter({ date: 'medium' });

			cf.should.be.a.Function;
			cf(new Date('2020-01-01')).should.equal('Dec 31, 2019');

			done();
		});
	});

	describe('dateParser', function() {
		it('should return a valid parser', function(done) {
			var cf = tester.dateParser();

			cf.should.be.a.Function;
			cf('12/31/2019').should.be.a.Date();

			done();
		});

		it('should return a valid parser with options', function(done) {
			var cf = tester.dateParser({ date: 'medium' });

			cf.should.be.a.Function;
			cf('Dec 31, 2019').should.be.a.Date();

			done();
		});
	});

	describe('messageFormatter', function() {
		it('should throw an error without a path', function(done) {
			tester.messageFormatter.should.throw();

			done();
		});
	});

	describe('numberFormatter', function() {
		it('should return a valid formatter', function(done) {
			var cf = tester.numberFormatter();

			cf.should.be.a.Function;
			cf(5000).should.equal('5,000');

			done();
		});

		it('should return a valid formatter with options', function(done) {
			var cf = tester.numberFormatter({ minimumFractionDigits: 2, round: 'floor' });

			cf.should.be.a.Function;
			cf(5000).should.equal('5,000.00');
			cf(123.45678).should.equal('123.456');

			done();
		});
	});

	describe('numberParser', function() {
		it('should return a valid parser', function(done) {
			var cf = tester.numberParser();

			cf.should.be.a.Function;
			cf('3.14159').should.equal(3.14159);
			cf('-0').should.equal(0);
			cf('10,501').should.equal(10501);
			cf('invalid').should.be.NaN();

			done();
		});

		it('should return a valid parser with options', function(done) {
			var cf = tester.numberParser({ style: 'percent' });

			cf.should.be.a.Function;
			cf('3.14159').should.be.NaN();
			cf('1%').should.equal(.01);
			cf('10,501%').should.equal(105.01);
			cf('invalid').should.be.NaN();

			done();
		});
	});

	describe('pluralGenerator', function() {
		it('should return a valid generator', function(done) {
			var cf = tester.pluralGenerator();

			cf.should.be.a.Function;
			cf(0).should.equal('other');
			cf(1).should.equal('one');
			cf(2).should.equal('other');
			cf(3).should.equal('other');

			done();
		});

		it('should return a valid generator for ordinals', function(done) {
			var cf = tester.pluralGenerator({ type: 'ordinal' });

			cf.should.be.a.Function;
			cf(0).should.equal('other');
			cf(1).should.equal('one');
			cf(2).should.equal('two');
			cf(3).should.equal('few');

			done();
		});

		it('should return a valid generator for cardinals', function(done) {
			var cf = tester.pluralGenerator({ type: 'cardinal' });

			cf.should.be.a.Function;
			cf(0).should.equal('other');
			cf(1).should.equal('one');
			cf(2).should.equal('other');
			cf(3).should.equal('other');

			done();
		});
	});

	describe('relativeTimeFormatter', function() {
		it('should throw an error without a unit', function(done) {
			tester.relativeTimeFormatter.should.throw();

			done();
		});

		it('should return a valid formatter for a unit', function(done) {
			var cf = tester.relativeTimeFormatter('day');

			cf.should.be.a.Function;
			cf(-1).should.equal('yesterday');
			cf(1).should.equal('tomorrow');
			cf(-30).should.equal('30 days ago');

			done();
		});

		it('should return a valid formatter for a unit month', function(done) {
			var cf = tester.relativeTimeFormatter('month');

			cf.should.be.a.Function;
			cf(-1).should.equal('last month');
			cf(1).should.equal('next month');
			cf(-30).should.equal('30 months ago');

			done();
		});
	});
};

describe('GlobalizeHelper', function() {
	before(function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US' ];

		express_globalize.setSupportedLocales([locale]);

		tester = express_globalize.getForLocale(locale);

		done();
	});

	helperTestSuite();
});

describe('GlobalizeRuntimeHelper', function() {
	before(function(done) {
		const cldrData = require('cldr-data');

		// Load the locale specific data
		Globalize.load(cldrData.entireSupplemental());
		Globalize.load(cldrData.entireMainFor(bundle));
		Globalize.locale(locale);

		// Create the compiled formatters/parsers
		var formattersAndParsers = [
			Globalize.currencyFormatter('USD'),
			Globalize.currencyFormatter('USD', { style: "code" }),
			Globalize.dateFormatter(),
			Globalize.dateFormatter({ date: 'medium' }),
			Globalize.dateParser(),
			Globalize.dateParser({ date: 'medium' }),
			Globalize.numberFormatter(),
			Globalize.numberFormatter({ minimumFractionDigits: 2, round: 'floor' }),
			Globalize.numberParser(),
			Globalize.numberParser({ style: 'percent' }),
			Globalize.pluralGenerator({ type: 'ordinal' }),
			Globalize.pluralGenerator({ type: 'cardinal' }),
			Globalize.relativeTimeFormatter('day'),
			Globalize.relativeTimeFormatter('month')
		];

		fs.mkdirSync('./tmp', { recursive: true });
		fs.writeFileSync('./tmp/compiled.en-US.js', globalizeCompiler.compile(formattersAndParsers, {}));

		var express_globalize = createExpressGlobalize();

		express_globalize.setSupportedLocales([ locale ], {
			compiledSourceLocation: path.resolve('./tmp/compiled.%s')
		});

		tester = express_globalize.getForLocale(locale);

		done();
	});

	helperTestSuite();
});

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

describe('GlobalizeHelper', function() {
	var tester;

	before(function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US' ];

		express_globalize.setSupportedLocales(locales);

		tester = express_globalize.getForLocale('en-US');

		done();
	});

	it('should have the proper functions', function(done) {
		var express_globalize = createExpressGlobalize();
		var locales = [ 'en-US' ];

		express_globalize.setSupportedLocales(locales);

		var result = express_globalize.getForLocale('en-US');

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

			done();
		});

		it('should return a valid formatter for a currency with options', function(done) {
			var cf = tester.currencyFormatter('USD', { style: "code" });

			cf.should.be.a.Function;

			done();
		});
	});

	describe('dateFormatter', function() {
		it('should return a valid formatter', function(done) {
			var cf = tester.dateFormatter();

			cf.should.be.a.Function;

			done();
		});

		it('should return a valid formatter with options', function(done) {
			var cf = tester.dateFormatter({ date: 'medium' });

			cf.should.be.a.Function;

			done();
		});
	});

	describe('dateParser', function() {
		it('should return a valid parser', function(done) {
			var cf = tester.dateParser();

			cf.should.be.a.Function;

			done();
		});

		it('should return a valid parser with options', function(done) {
			var cf = tester.dateParser({ date: 'medium' });

			cf.should.be.a.Function;

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

			done();
		});

		it('should return a valid formatter with options', function(done) {
			var cf = tester.numberFormatter({ minimumFractionDigits: 2, round: 'floor' });

			cf.should.be.a.Function;

			done();
		});
	});

	describe('numberParser', function() {
		it('should return a valid parser', function(done) {
			var cf = tester.numberParser();

			cf.should.be.a.Function;

			done();
		});

		it('should return a valid parser with options', function(done) {
			var cf = tester.numberParser({ style: 'percent' });

			cf.should.be.a.Function;

			done();
		});
	});

	describe('pluralGenerator', function() {
		it('should return a valid generator', function(done) {
			var cf = tester.pluralGenerator();

			cf.should.be.a.Function;

			done();
		});

		it('should return a valid generator with options', function(done) {
			var cf = tester.pluralGenerator({ type: 'ordinal' });

			cf.should.be.a.Function;

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

			done();
		});

		it('should return a valid formatter for a unit month', function(done) {
			var cf = tester.relativeTimeFormatter('month');

			cf.should.be.a.Function;

			done();
		});
	});
});
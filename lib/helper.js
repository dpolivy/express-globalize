var _path = require('path');
var Globalize = require('globalize');
var Cldr = require('cldrjs');

var MAIN_FILES = ["ca-gregorian", "currencies", "dateFields", "numbers",
	"timeZoneNames"
];

var SUPPLEMENTAL_FILES = ["currencyData", "likelySubtags","numberingSystems",
	"ordinals", "plurals", "timeData", "weekData"
];

function mainPathsFor(locales) {
	return locales.reduce(function(sum, locale) {
		MAIN_FILES.forEach(function(mainFile) {
			sum.push(require(_path.join("cldr-data/main", locale, mainFile)));
		});
		return sum;
	}, []);
}

function supplementalPaths() {
	return SUPPLEMENTAL_FILES.map(function(supplementalFile) {
		return require(_path.join("cldr-data/supplemental", supplementalFile));
	});
}

// Initialize the Cldr loader
// https://github.com/rxaviers/cldrjs/issues/30
Cldr.setAvailableBundlesHack = function(availableLocales) {
	availableLocales.splice(availableLocales.indexOf("root"), 1);
	this._availableBundleMapQueue = availableLocales;
};

// Assign the availableLocales to Cldr, so we can see how it will resolve
// each requested locale
Cldr.load(require('cldr-data/supplemental/likelySubtags.json'));
Cldr.setAvailableBundlesHack(require('cldr-data/availableLocales.json').availableLocales);

// Load the supplemental files
Globalize.load(supplementalPaths());

// Helper to "hash" an options object passed to a formatter.
// Used to help with caching of formatters
function hashOptions(options) {
	options = options || {};
	return JSON.stringify(options);
};

/**
 * [new] GlobalizeHelper(locale[, currencyCode])
 *
 * Creates an instance of the helper for a given locale. An optional
 * default currencyCode can be provided as a convenience.
 */
var GlobalizeHelper = function(locale, currencyCode) {
	locale = locale;

	// Save instance variables
	this.locale = locale;
	this.currencyCode = currencyCode;

	// Figure out which bundle to load for this locale
	var bundle = new Cldr(locale).attributes.bundle;

	// If there's no matching bundle, throw an error
	if (!bundle) {
		console.error('ERROR: Unable to find matching bundle for locale [' + locale + ']');
		throw new Error('ERROR: Unable to find matching bundle for locale [' + locale + ']')
	}

	// Load the locale-specific files
	Globalize.load(mainPathsFor([ bundle ]));

	// Create the new Globalize object for this locale
	this.globalize = new Globalize(locale);

	// Cache generated formatters
	this._currencyFormatters = {};
	this._dateFormatters = {};
	this._dateParsers = {};
	this._messageFormatters = {};
	this._numberFormatters = {};
	this._numberParsers = {};
	this._pluralGenerators = {};
	this._relativeTimeFormatters = {};

	// Delete the unused Cldr instance
	delete bundle;
};

/**
 * GlobalizeHelper.currencyFormatter(currency[, options])
 *
 * Creates an instance of a currency formatter for the specified currency.
 */
GlobalizeHelper.prototype.currencyFormatter = function(currency, options) {
	var key = hashOptions(options);
	currency = currency || this.currencyCode;
	if (!this._currencyFormatters[currency]) {
		this._currencyFormatters[currency] = {};
	}
	if (!this._currencyFormatters[currency][key]) {
		this._currencyFormatters[currency][key] = this.globalize.currencyFormatter(currency, options);
	}
	return this._currencyFormatters[currency][key];
};

/**
 * GlobalizeHelper.dateFormatter([options])
 *
 * Creates an instance of a date formatter.
 */
GlobalizeHelper.prototype.dateFormatter = function(options) {
	var key = hashOptions(options);
	if (!this._dateFormatters[key]) {
		this._dateFormatters[key] = this.globalize.dateFormatter(options);
	}
	return this._dateFormatters[key];
};

/**
 * GlobalizeHelper.dateParser([options])
 *
 * Creates an instance of a date parser.
 */
GlobalizeHelper.prototype.dateParser = function(options) {
	var key = hashOptions(options);
	if (!this._dateParsers[key]) {
		this._dateParsers[key] = this.globalize.dateParser(options);
	}
	return this._dateParsers[key];
};

/**
 * GlobalizeHelper.loadMessages(json)
 *
 * Loads the messages data.
 */
GlobalizeHelper.prototype.loadMessages = function(json) {
	return this.globalize.loadMessages(json);
};

/**
 * GlobalizeHelper.messageFormatter(path)
 *
 * Creates an instance of a message formatter.
 */
GlobalizeHelper.prototype.messageFormatter = function(path) {
	if (!this._messageFormatters[path]) {
		this._messageFormatters[path] = this.globalize.messageFormatter(path);
	}
	return this._messageFormatters[path];
};

/**
 * GlobalizeHelper.numberFormatter([options])
 *
 * Creates an instance of a number formatter.
 */
GlobalizeHelper.prototype.numberFormatter = function(options) {
	var key = hashOptions(options);
	if (!this._numberFormatters[key]) {
		this._numberFormatters[key] = this.globalize.numberFormatter(options);
	}
	return this._numberFormatters[key];
};

/**
 * GlobalizeHelper.numberParser([options])
 *
 * Creates an instance of a number parser.
 */
GlobalizeHelper.prototype.numberParser = function(options) {
	var key = hashOptions(options);
	if (!this._numberParsers[key]) {
		this._numberParsers[key] = this.globalize.numberParser(options);
	}
	return this._numberParsers[key];
};

/**
 * GlobalizeHelper.pluralGenerator([options])
 *
 * Creates an instance of a plural generator.
 */
GlobalizeHelper.prototype.pluralGenerator = function(options) {
	var key = hashOptions(options);
	if (!this._pluralGenerators[key]) {
		this._pluralGenerators[key] = this.globalize.pluralGenerator(options);
	}
	return this._pluralGenerators[key];
};

/**
 * GlobalizeHelper.relativeTimeFormatter(unit[, options])
 *
 * Creates an instance of a relative time formatter for the specified unit.
 */
GlobalizeHelper.prototype.relativeTimeFormatter = function(unit, options) {
	var key = hashOptions(options);
	if (!this._relativeTimeFormatters[unit]) {
		this._relativeTimeFormatters[unit] = {};
	}
	if (!this._relativeTimeFormatters[unit][key]) {
		this._relativeTimeFormatters[unit][key] = this.globalize.relativeTimeFormatter(unit, options);
	}
	return this._relativeTimeFormatters[unit][key];
};

module.exports = GlobalizeHelper;
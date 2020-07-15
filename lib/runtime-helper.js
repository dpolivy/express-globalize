/**
 * [new] GlobalizeRuntimeHelper(locale[, currencyCode])
 *
 * Creates an instance of the helper for a given locale. An optional
 * default currencyCode can be provided as a convenience.
 */
var GlobalizeRuntimeHelper = function(locale, currencyCode, fileName) {
	// Save instance variables
	this.locale = locale;
	this.currencyCode = currencyCode;

	// Load the compiled file, and create a new instance
	let Globalize = require(fileName);
	this.globalize = new Globalize(locale);
};

/**
 * GlobalizeRuntimeHelper.currencyFormatter(currency[, options])
 *
 * Creates an instance of a currency formatter for the specified currency.
 */
GlobalizeRuntimeHelper.prototype.currencyFormatter = function(currency, options) {
	// Set default currency if not specified
	currency = currency || this.currencyCode;
	return this.globalize.currencyFormatter(currency, options);
};

/**
 * GlobalizeRuntimeHelper.dateFormatter([options])
 *
 * Creates an instance of a date formatter.
 */
GlobalizeRuntimeHelper.prototype.dateFormatter = function(options) {
	return this.globalize.dateFormatter(options);
};

/**
 * GlobalizeRuntimeHelper.dateParser([options])
 *
 * Creates an instance of a date parser.
 */
GlobalizeRuntimeHelper.prototype.dateParser = function(options) {
	return this.globalize.dateParser(options);
};

/**
 * GlobalizeRuntimeHelper.loadMessages(json)
 *
 * Loads the messages data.
 */
GlobalizeRuntimeHelper.prototype.loadMessages = function(json) {
	return this.globalize.loadMessages(json);
};

/**
 * GlobalizeRuntimeHelper.messageFormatter(path)
 *
 * Creates an instance of a message formatter.
 */
GlobalizeRuntimeHelper.prototype.messageFormatter = function(path) {
	return this.globalize.messageFormatter(path);
};

/**
 * GlobalizeRuntimeHelper.numberFormatter([options])
 *
 * Creates an instance of a number formatter.
 */
GlobalizeRuntimeHelper.prototype.numberFormatter = function(options) {
	return this.globalize.numberFormatter(options);
};

/**
 * GlobalizeRuntimeHelper.numberParser([options])
 *
 * Creates an instance of a number parser.
 */
GlobalizeRuntimeHelper.prototype.numberParser = function(options) {
	return this.globalize.numberParser(options);
};

/**
 * GlobalizeRuntimeHelper.pluralGenerator([options])
 *
 * Creates an instance of a plural generator.
 */
GlobalizeRuntimeHelper.prototype.pluralGenerator = function(options) {
	return this.globalize.pluralGenerator(options);
};

/**
 * GlobalizeRuntimeHelper.relativeTimeFormatter(unit[, options])
 *
 * Creates an instance of a relative time formatter for the specified unit.
 */
GlobalizeRuntimeHelper.prototype.relativeTimeFormatter = function(unit, options) {
	return this.globalize.relativeTimeFormatter(unit, options);
};

module.exports = GlobalizeRuntimeHelper;
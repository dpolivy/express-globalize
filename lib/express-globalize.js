var GlobalizeHelper = require('./helper');

// Access a property on an object via string
var getValueFromString = function(path, origin) {
	if (origin === void 0 || origin === null) origin = this;
	if (typeof path !== 'string') path = '' + path;
	var parts = path.split(/\[|\]|\.|'|"/g).reverse(),
		name;
	while (parts.length) {
		name = parts.pop();
		if (name) origin = origin[name];
		if (origin === undefined) break;
	}
	return origin;
};

/**
 * [new] ExpressGlobalize()
 *
 * Creates an instance of the library
 */
var ExpressGlobalize = function() {
	this.supportedLocales = {};
};

/**
 * ExpressGlobalize.getForLocale(locale)
 *
 * Returns the Globalize instance that corresponds to the passed in locale.
 */
ExpressGlobalize.prototype.getForLocale = function(locale) {
	return this.supportedLocales[locale];
};

/**
 * ExpressGlobalize.globalizeHandler(localeProperty, defaultLocale)
 *
 * The express middleware that adds a Globalize instance to the `res.locals.intl`
 * property, based on the incoming request's desired locale. To create the middleware,
 * you have to pass in a `localeProperty`, which is a string that denotes the (sub-)property
 * of the `req` object which contains the locale to be used for the request.
 * The `defaultLocale` property is a default locale that is used, if the property does not
 * resolve.
 */
ExpressGlobalize.prototype.globalizeHandler = function(localeProperty, defaultLocale) {
	var self = this;
	return function(req, res, next) {
		res.locals.intl = self.supportedLocales[getValueFromString(localeProperty, req) || defaultLocale];
		next();
	};
};

/**
 * ExpressGlobalize.setSupportedLocales(locales)
 *
 * Configures the object for the given set of locales. The `locales` parameter
 * must be an array of either locale strings, or objects that also contain
 * default currency codes for the associated locale.
 *
 * e.g.:
 * [ 'en-US', 'fr-FR', 'de-DE' ]
 * [ { localeName: 'en-US', currencyCode: 'USD' }, { localeName: 'fr-FR', currencyCode: 'EUR' } ]
 */
ExpressGlobalize.prototype.setSupportedLocales = function(locales) {
	if (Object.prototype.toString.call(locales) !== '[object Array]' || locales.length < 1) {
		throw new TypeError('Supported locales must be an array of at least 1 element.');
	}

	var self = this;

	locales.forEach(function(locale) {
		// Array of Strings
		if (typeof locale === 'string') {
			self.supportedLocales[locale] = new GlobalizeHelper(locale);
		}
		// Array of objects
		else {
			self.supportedLocales[locale.localeName] = new GlobalizeHelper(locale.localeName, locale.currencyCode);
		}
	});
};

module.exports = new ExpressGlobalize();
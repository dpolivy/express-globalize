# express-globalize #

[Express](http://expressjs.com/) middleware that provides internationalization features via [Globalize](https://github.com/jquery/globalize).

## Install ##

```
npm install express-globalize --save
npm install cldr-data --save
```

*Note:* You must install the [cldr-data](https://github.com/rxaviers/cldr-data-npm) package as a peer of `express-globalize`.
By default, `cldr-data` installs the "modern" language suite, but you can install the full suite by following the instructions
[here](https://github.com/rxaviers/cldr-data-npm#locale-coverage).

## Use ##

You must initialize *express-globalize* with a list of supported locales, like so:

```javascript
var express_globalize = require('express-globalize');
express_globalize.setSupportedLocales([ { localeName: 'en-US', currencyCode: 'USD' }, { localeName: 'de-DE', currencyCode: 'EUR' }]);
app.use(express_globalize.globalizeHandler('user.localeString', 'en-US'));
```

Please see the detailed documentation below for further information on parameters.

## API ##

### setSupportedLocales ###

```javascript
express_globalize.setSupportedLocales(locales)
```

Configures the object for the given set of locales. The `locales` parameter
must be an array of either locale strings, or objects that also contain
default currency codes for the associated locale.

If an array of objects are passed in, the valid properties are:
- `localeName`: The language-region string for the locale
- `currencyCode`: The ISO 4217 currency code to use as the "default" for this locale (optional)

```javascript
[ 'en-US', 'fr-FR', 'de-DE' ]
[ { localeName: 'en-US', currencyCode: 'USD' }, { localeName: 'fr-FR', currencyCode: 'EUR' } ]
```

*express-globalize* will perform the work of mapping the locale strings into the
proper CLDR bundle files. If no corresponding CLDR bundle is found for a passed
locale, an exception will be thrown.

### globalizeHandler ###

```javascript
express_globalize.globalizeHandler(localeProperty, defaultLocale);
```

The express middleware that adds a Globalize instance to the `res.locals.intl`
property, based on the incoming request's desired locale. To create the middleware,
you have to pass in the following parameters:

- `localeProperty`: A string that denotes the (sub-)property of the `req` object
which contains the locale to be used for the request. For example, if the
locale for the request is attached to the `req.user.localeString` property, you would
pass `'user.localeString'` as the value for this parameter.
- `defaultLocale`: A default locale that is used for the request, if the
`localeProperty` property does not resolve.

Once this middleware runs, you will find the globalize object stored in
`res.locals.intl`.

### res.locals.intl / GlobalizeHelper ###

Once the middleware has been run, a `res.locals.intl` property is created which
contains a copy of the `GlobalizeHelper` object for the user's locale. `GlobalizeHelper`
is a small wrapper on top of `Globalize` which adds:

- automatic loading of required cldr-data bundle files
- caching support for formatters
- default currency support when calling `currencyFormatter()`

There is one copy of a GlobalizeHelper object created for each supported locale,
and the objects are re-used across requests for performance reasons.

The underlying `Globalize` object is available via `res.locals.intl.globalize`. However,
all formatter and parser methods are available on `GlobalizeHelper`, so you can use
it transparently, the same way you would use `Globalize`. For more details on
the supported methods, please see the [Globalize API documentation](https://github.com/jquery/globalize#api).

## History ##

**v0.1.1**
- Fix issue with properties that may not exist
- Update dependency versions

**v0.1.0**
- Initial release

## License ##
This project is distributed under the MIT license.
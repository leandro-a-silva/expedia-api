
var request = require("request");
var crypto  = require("crypto");

module.exports = function(options) {
  var scope = this;

  this.server   = "http://api.ean.com/ean-services/rs/hotel/v3/";
  this.booking  = "https://book.api.ean.com/ean-services/rs/hotel/v3/";
  this.customer = {};
  this.options  = options || {
    apiExperience: "PARTNER_WEBSITE",
    apiKey: null,
    cid: null,
    currencyCode: "USD",
    locale: "en_US",
    sharedSecret: null,
    sig: null
  };

  /**
   * _constructor - Init methods with initialize.
   *
   */
  function _constructor () {
    _removeSharedSecret();
  }

  /**
   * _removeSharedSecret
   * Remove sharedSecret in options, before include value in scope.
   *
   */
  function _removeSharedSecret () {
    scope.sharedSecret = scope.options.sharedSecret || null;
    delete scope.options.sharedSecret;
  }

  /**
   * _generateSig
   * Create SIG authenticate with hash in md5 (apiKey, sharedSecret and timestamp).
   *
   */
  function _generateSig () {
    // Get timestamp moment request.
    var timestamp = Math.round( new Date().getTime() / 1000 );

    // Generate hash and update SIG code in common request.
    scope.options.sig = crypto.createHash("md5")
                              .update(scope.options.apiKey + scope.sharedSecret + timestamp)
                              .digest("hex");
  }

  /**
   * _parseParams - Convert object JSON in URI string format.
   *
   * @param  {object} obj object original.
   * @return {string}     string URI encode component.
   */
  function _parseParams (obj) {

    return Object.keys(obj).map(function(key){
      return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
    }).join('&');

  }


  /**
   * _url - Mount URL for request in _request.
   *
   * @param  {string} method     partial URL method.
   * @param  {object} parameters parameters for request method.
   * @return {string}            return URL for request.
   */
  function _url (method, parameters, server) {
    var session = _parseParams(scope.options) + '&' + _parseParams( scope.customer );
    return (server || scope.server) + method + "/?" + session + "&" + _parseParams(parameters);
  };


  /**
   * _request - description
   *
   * @param  {string} method     partial URL value.
   * @param  {object} parameters parameters for request method.
   * @param  {function} next     callback with response.
   * @param  {string} server     opcional server.
   */
  function _request (method, parameters, next, server) {

    _generateSig();

    request.get( _url(method, parameters), function (error, response, body) {
      next(body);
    }, server);
  }

  this.changeLocale = function (code) {
    scope.options.locale = code;
  }

  this.changeCurrencyCode = function (code) {
    scope.options.currencyCode = code;
  }

  this.changeApiExperience = function (code) {
    scope.options.apiExperience = code;
  }

  this.customer = function (obj) {
    scope.customer = obj;
    return;
  }

  this.hotels = function (parameters, next) {
    _request("list", parameters, function (response) {
      next(response);
    });
  }

  this.hotel = {

    info: function (parameters, next) {
      _request("info", parameters, function (response) {
        next(response);
      });
    },

    payments: function (parameters, next) {
      _request("paymentInfo", parameters, function (response) {
        next(response);
      });
    },

    rooms: function (parameters, next) {
      _request("avail", parameters, function (response) {
        next(response);
      });
    },

    room: {

      images: function (parameters, next) {
        _request("roomImages", parameters, function (response) {
          next(response);
        });
      }

    },

    reservation: {

      book: function (parameters, next) {
        _request("res", parameters, function (response) {
          next(response);
        }, scope.booking);
      },

      get: function (parameters, next) {
        _request("itin", parameters, function (response) {
          next(response);
        });
      },

      cancel: function (parameters, next) {
        _request("cancel", parameters, function (response) {
          next(response);
        });
      }

    }

  }

  _constructor();

  return this;
}

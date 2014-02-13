(function() {
  var __hasProp = {}.hasOwnProperty;

  define(['lib/underscore'], function(_) {
    var LS;

    return LS = (function() {
      function LS(namespace) {
        this.namespace = namespace;
        if (this.namespace) {
          this.data = JSON.parse(localStorage[this.namespace] || '{}');
        }
      }

      LS.prototype.set = function(settings) {
        var key, value, _results;

        if (this.namespace) {
          for (key in settings) {
            if (!__hasProp.call(settings, key)) continue;
            value = settings[key];
            this.data[key] = value;
          }
          return localStorage[this.namespace] = JSON.stringify(this.data);
        } else {
          _results = [];
          for (key in settings) {
            if (!__hasProp.call(settings, key)) continue;
            value = settings[key];
            _results.push(localStorage[key] = JSON.stringify(value));
          }
          return _results;
        }
      };

      LS.prototype.get = function(key) {
        if (this.namespace) {
          return this.data[key];
        } else {
          return JSON.parse(localStorage[key] || 'null');
        }
      };

      LS.prototype.hasData = function() {
        return !_.isEmpty(this.data);
      };

      return LS;

    })();
  });

}).call(this);

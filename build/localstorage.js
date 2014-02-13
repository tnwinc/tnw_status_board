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
        var key, value, _results, _results1;

        if (this.namespace) {
          _results = [];
          for (key in settings) {
            if (!__hasProp.call(settings, key)) continue;
            value = settings[key];
            this.data[key] = value;
            _results.push(this._save());
          }
          return _results;
        } else {
          _results1 = [];
          for (key in settings) {
            if (!__hasProp.call(settings, key)) continue;
            value = settings[key];
            _results1.push(localStorage[key] = JSON.stringify(value));
          }
          return _results1;
        }
      };

      LS.prototype.get = function(key) {
        if (this.namespace) {
          return this.data[key];
        } else {
          return JSON.parse(localStorage[key] || 'null');
        }
      };

      LS.prototype.remove = function(key) {
        if (this.namespace) {
          delete this.data[key];
          return this._save();
        } else {
          return localStorage.removeItem(key);
        }
      };

      LS.prototype.hasData = function() {
        return !_.isEmpty(this.data);
      };

      LS.prototype._save = function() {
        return localStorage[this.namespace] = JSON.stringify(this.data);
      };

      return LS;

    })();
  });

}).call(this);

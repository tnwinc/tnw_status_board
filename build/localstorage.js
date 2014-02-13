(function() {
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
        var key, value, _i, _j, _len, _len1, _results;

        if (this.namespace) {
          for (value = _i = 0, _len = settings.length; _i < _len; value = ++_i) {
            key = settings[value];
            this.data[key] = value;
          }
          return localStorage[this.namespace] = JSON.stringify(this.data);
        } else {
          _results = [];
          for (value = _j = 0, _len1 = settings.length; _j < _len1; value = ++_j) {
            key = settings[value];
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

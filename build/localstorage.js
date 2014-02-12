(function() {
  define(function() {
    var LS;

    return LS = (function() {
      function LS(namespace) {
        this.namespace = namespace;
        if (this.namespace) {
          this.data = JSON.parse(localStorage[this.namespace] || '{}');
        }
      }

      LS.prototype.set = function(key, value) {
        if (this.namespace) {
          this.data[key] = value;
          return localStorage[this.namespace] = JSON.stringify(this.data);
        } else {
          return localStorage[key] = JSON.stringify(value);
        }
      };

      LS.prototype.get = function(key) {
        if (this.namespace) {
          return this.data[key];
        } else {
          return JSON.parse(localStorage[key] || 'null');
        }
      };

      return LS;

    })();
  });

}).call(this);

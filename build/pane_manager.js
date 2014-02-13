(function() {
  define(['localstorage', 'lib/underscore', 'lib/handlebars', 'hbs_helpers/pane_style'], function(LS, _, Handlebars) {
    var NAMESPACE, Pane, PaneManager, Property, randomId;

    NAMESPACE = 'pane_manager';
    randomId = function() {
      return Math.floor(Math.random() * 100000);
    };
    Property = (function() {
      function Property(name, value, units) {
        this.name = name;
        this.value = value;
        this.units = units;
      }

      Property.prototype.toString = function() {
        if (this.value === 0) {
          return this.value.toString();
        } else {
          return "" + this.value + this.units;
        }
      };

      return Property;

    })();
    Pane = (function() {
      function Pane(id, url, properties) {
        this.id = id;
        this.url = url != null ? url : '';
        this.properties = properties;
      }

      return Pane;

    })();
    return PaneManager = (function() {
      function PaneManager() {
        var id, pane, panes, properties;

        this.ls = new LS(NAMESPACE);
        panes = this.ls.get('panes') || {};
        this.panes = {};
        for (id in panes) {
          pane = panes[id];
          properties = _.map(pane.properties, function(property) {
            return new Property(property.name, property.value, property.units);
          });
          this.panes[id] = new Pane(id, pane.url, properties);
        }
        if (!this.ls.hasData()) {
          this.firstRun();
        }
        this.renderPanes();
      }

      PaneManager.prototype.firstRun = function() {
        var key, migratePane, oldLs, panesToMigrate, properties,
          _this = this;

        oldLs = new LS();
        migratePane = function(key, properties) {
          var id, url;

          if (url = oldLs.get(key)) {
            properties = _.map(properties, function(property) {
              return (function(func, args, ctor) {
                ctor.prototype = func.prototype;
                var child = new ctor, result = func.apply(child, args);
                return Object(result) === result ? result : child;
              })(Property, property, function(){});
            });
            id = randomId();
            _this.panes[id] = new Pane(id, url, properties);
            return oldLs.remove(key);
          }
        };
        panesToMigrate = {
          'panes.topLeft': [['left', 0, 'px'], ['top', 0, 'px'], ['width', 25, '%'], ['height', 450, 'px']],
          'panes.topMiddle': [['left', 25, '%'], ['top', 0, 'px'], ['width', 25, '%'], ['height', 450, 'px']],
          'panes.topRight': [['right', 0, 'px'], ['top', 0, 'px'], ['width', 50, '%'], ['height', 450, 'px']],
          'panes.bottom': [['top', 450, 'px'], ['right', 0, 'px'], ['bottom', 0, 'px'], ['left', 0, 'px']]
        };
        for (key in panesToMigrate) {
          properties = panesToMigrate[key];
          migratePane(key, properties);
        }
        return this.ls.set({
          panes: this.panes
        });
      };

      PaneManager.prototype.renderPanes = function() {
        var template;

        template = Handlebars.compile($('#view-panes-template').html());
        return $(template({
          panes: this.panes
        })).appendTo('#view-panes');
      };

      return PaneManager;

    })();
  });

}).call(this);

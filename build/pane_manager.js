(function() {
  define(['localstorage', 'lib/underscore', 'lib/handlebars', 'hbs_helpers/pane_style'], function(LS, _, Handlebars) {
    var $body, NAMESPACE, Pane, PaneManager, Property, randomId;

    NAMESPACE = 'pane_manager';
    $body = $(document.body);
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

      Pane.prototype.makeFullScreen = function() {
        var $el;

        $el = $("#p-" + this.id);
        $el.animate({
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          width: 'auto',
          height: 'auto'
        });
        return $el.addClass('in-standup');
      };

      Pane.prototype.resetPosition = function() {
        var $el, css, property, _i, _len, _ref;

        $el = $("#p-" + this.id);
        $el.style = '';
        css = {};
        _ref = this.properties;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          property = _ref[_i];
          css[property.name] = property.toString();
        }
        $el.css(css);
        return $el.removeClass('in-standup');
      };

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
          this.panes[id] = new Pane(pane.id, pane.url, properties);
        }
        if (!this.ls.hasData()) {
          this.firstRun();
        }
        this.renderPanes('view');
        this.bindEvents();
      }

      PaneManager.prototype.bindEvents = function() {
        var _this = this;

        return $body.on('click', '#edit-panes', function(e) {
          e.preventDefault();
          return _this.editPanes();
        });
      };

      PaneManager.prototype.editPanes = function() {
        return this.renderPanes('edit');
      };

      PaneManager.prototype.standupPane = function() {
        var id;

        id = this.ls.get('standupPaneId');
        return _.find(this.panes, function(pane) {
          return pane.id === id;
        });
      };

      PaneManager.prototype.firstRun = function() {
        var migratePane, oldLs, pane, panesToMigrate, _i, _len,
          _this = this;

        oldLs = new LS();
        migratePane = function(pane) {
          var id, properties, url;

          if (url = oldLs.get(pane.oldKey)) {
            properties = _.map(pane.properties, function(property) {
              return (function(func, args, ctor) {
                ctor.prototype = func.prototype;
                var child = new ctor, result = func.apply(child, args);
                return Object(result) === result ? result : child;
              })(Property, property, function(){});
            });
            id = randomId();
            _this.panes[id] = new Pane(id, url, properties);
            if (pane.standup) {
              _this.ls.set({
                standupPaneId: id
              });
            }
            return oldLs.remove(pane.oldKey);
          }
        };
        panesToMigrate = [
          {
            oldKey: 'panes.topLeft',
            properties: [['left', 0, 'px'], ['top', 0, 'px'], ['width', 25, '%'], ['height', 450, 'px']]
          }, {
            oldKey: 'panes.topMiddle',
            properties: [['left', 25, '%'], ['top', 0, 'px'], ['width', 25, '%'], ['height', 450, 'px']]
          }, {
            oldKey: 'panes.topRight',
            properties: [['right', 0, 'px'], ['top', 0, 'px'], ['width', 50, '%'], ['height', 450, 'px']]
          }, {
            oldKey: 'panes.bottom',
            standup: true,
            properties: [['top', 450, 'px'], ['right', 0, 'px'], ['bottom', 0, 'px'], ['left', 0, 'px']]
          }
        ];
        for (_i = 0, _len = panesToMigrate.length; _i < _len; _i++) {
          pane = panesToMigrate[_i];
          migratePane(pane);
        }
        return this.ls.set({
          panes: this.panes
        });
      };

      PaneManager.prototype.renderPanes = function(type) {
        var template;

        template = Handlebars.compile($("#" + type + "-panes-template").html());
        return $(template({
          panes: this.panes
        })).appendTo("#" + type + "-panes-container");
      };

      return PaneManager;

    })();
  });

}).call(this);

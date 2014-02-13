(function() {
  define(['localstorage', 'lib/handlebars', 'hbs_helpers/pane_style'], function(LS, Handlebars) {
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
        var bottomUrl, id, oldLs, properties, topLeftUrl, topMiddleUrl, topRightUrl;

        oldLs = new LS();
        if (topLeftUrl = oldLs.get('panes.topLeft')) {
          properties = [new Property('left', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          id = randomId();
          this.panes[id] = new Pane(id, topLeftUrl, properties);
        }
        if (topMiddleUrl = oldLs.get('panes.topMiddle')) {
          properties = [new Property('left', 25, '%'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          id = randomId();
          this.panes[id] = new Pane(id, topMiddleUrl, properties);
        }
        if (topRightUrl = oldLs.get('panes.topRight')) {
          properties = [new Property('right', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 50, '%'), new Property('height', 450, 'px')];
          id = randomId();
          this.panes[id] = new Pane(id, topRightUrl, properties);
        }
        if (bottomUrl = oldLs.get('panes.bottom')) {
          properties = [new Property('top', 450, 'px'), new Property('right', 0, 'px'), new Property('bottom', 0, 'px'), new Property('left', 0, 'px')];
          id = randomId();
          this.panes[id] = new Pane(id, bottomUrl, properties);
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

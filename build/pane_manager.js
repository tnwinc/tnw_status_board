(function() {
  define(['localstorage', 'lib/handlebars', 'hbs_helpers/pane_style'], function(LS, Handlebars) {
    var NAMESPACE, Pane, PaneManager, Property;

    NAMESPACE = 'pane_manager';
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
      function Pane(url, properties) {
        this.url = url != null ? url : '';
        this.properties = properties;
      }

      return Pane;

    })();
    return PaneManager = (function() {
      function PaneManager() {
        this.ls = new LS(NAMESPACE);
        this.panes = this.ls.get('panes') || [];
        if (!this.ls.hasData()) {
          this.firstRun();
        }
        this.renderPanes();
      }

      PaneManager.prototype.firstRun = function() {
        var bottomUrl, oldLs, properties, topLeftUrl, topMiddleUrl, topRightUrl;

        oldLs = new LS();
        if (topLeftUrl = oldLs.get('panes.topLeft')) {
          properties = [new Property('left', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          this.panes.push(new Pane(topLeftUrl, properties));
        }
        if (topMiddleUrl = oldLs.get('panes.topMiddle')) {
          properties = [new Property('left', 25, '%'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          this.panes.push(new Pane(topMiddleUrl, properties));
        }
        if (topRightUrl = oldLs.get('panes.topRight')) {
          properties = [new Property('right', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 50, '%'), new Property('height', 450, 'px')];
          this.panes.push(new Pane(topRightUrl, properties));
        }
        if (bottomUrl = oldLs.get('panes.bottom')) {
          properties = [new Property('top', 450, 'px'), new Property('right', 0, 'px'), new Property('bottom', 0, 'px'), new Property('left', 0, 'px')];
          return this.panes.push(new Pane(bottomUrl, properties));
        }
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

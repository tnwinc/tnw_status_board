(function() {
  define(['localstorage', 'lib/handlebars', 'hbs_helpers/iframe_style'], function(LS, Handlebars) {
    var Frame, FrameManager, NAMESPACE, Property;

    NAMESPACE = 'frame_manager';
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
    Frame = (function() {
      function Frame(url, properties) {
        this.url = url != null ? url : '';
        this.properties = properties;
      }

      return Frame;

    })();
    return FrameManager = (function() {
      function FrameManager() {
        this.ls = new LS(NAMESPACE);
        this.frames = this.ls.get('frames') || [];
        if (!this.ls.hasData()) {
          this.firstRun();
        }
        this.renderFrames();
      }

      FrameManager.prototype.firstRun = function() {
        var bottomUrl, oldLs, properties, topLeftUrl, topMiddleUrl, topRightUrl;

        oldLs = new LS();
        if (topLeftUrl = oldLs.get('panes.topLeft')) {
          properties = [new Property('left', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          this.frames.push(new Frame(topLeftUrl, properties));
        }
        if (topMiddleUrl = oldLs.get('panes.topMiddle')) {
          properties = [new Property('left', 25, '%'), new Property('top', 0, 'px'), new Property('width', 25, '%'), new Property('height', 450, 'px')];
          this.frames.push(new Frame(topMiddleUrl, properties));
        }
        if (topRightUrl = oldLs.get('panes.topRight')) {
          properties = [new Property('right', 0, 'px'), new Property('top', 0, 'px'), new Property('width', 50, '%'), new Property('height', 450, 'px')];
          this.frames.push(new Frame(topRightUrl, properties));
        }
        if (bottomUrl = oldLs.get('panes.bottom')) {
          properties = [new Property('top', 450, 'px'), new Property('right', 0, 'px'), new Property('bottom', 0, 'px'), new Property('left', 0, 'px')];
          return this.frames.push(new Frame(bottomUrl, properties));
        }
      };

      FrameManager.prototype.renderFrames = function() {
        var template;

        template = Handlebars.compile($('#view-frames-template').html());
        return $(template({
          frames: this.frames
        })).appendTo('#view-frames');
      };

      return FrameManager;

    })();
  });

}).call(this);

(function() {
  define(['localstorage'], function(LS) {
    var FrameManager, NAMESPACE;

    NAMESPACE = 'frame_manager';
    return FrameManager = (function() {
      function FrameManager() {
        this.ls = new LS(NAMESPACE);
        this.frames = this.ls.get('frames') || [];
      }

      return FrameManager;

    })();
  });

}).call(this);

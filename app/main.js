(function() {
  define(["env/localstorage", "env/window", "env/document"], function(storage, win, doc) {
    var channel, key, pusher;
    $(function() {
      return $("frame").each(function() {
        var url;
        console.log("looking for: ", "panes." + $(this).attr('id'));
        if ((url = storage.getItem("panes." + $(this).attr('id')))) {
          return $(this).attr('src', url);
        }
      });
    });
    if (!(key = storage.getItem("pusher.api-key"))) {
      key = win.prompt("What is the pusher api key?");
      storage.setItem("pusher.api-key", key);
    }
    Pusher.log = function(message) {
      if (win.console && win.console.log) {
        return win.console.log(message);
      }
    };
    pusher = new Pusher(key);
    channel = pusher.subscribe('test_channel');
    channel.bind('reload_board', function(data) {
      return win.location.reload();
    });
    channel.bind('start_standup', function(data) {
      var framesets, millisecondsUntilStandupEnds, oldSize;
      framesets = doc.getElementsByTagName("frameset");
      oldSize = framesets[0].rows;
      framesets[0].rows = "0,*";
      millisecondsUntilStandupEnds = 1000 * 60 * (data || 16);
      return setTimeout(function() {
        return framesets[0].rows = oldSize;
      }, millisecondsUntilStandupEnds);
    });
    return channel.bind('set_url', function(data) {
      console.log("setting: ", "panes." + $(this).attr('id'));
      storage.setItem("panes." + data.pane, data.url);
      return $("#" + data.pane).attr('src', data.url);
    });
  });
}).call(this);

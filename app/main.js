(function() {
  var __hasProp = Object.prototype.hasOwnProperty;
  define(["env/localstorage", "env/window", "env/document"], function(storage, win, doc) {
    var EventHandlers, channel, event, handler, key, pusher, _results;
    $(function() {
      return $("iframe").each(function() {
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
    EventHandlers = {
      reload_board: function(data) {
        return $(body).fadeOut(function() {
          return win.location.reload();
        });
      },
      start_standup: function(data) {
        var container, millisecondsUntilStandupEnds, oldTop;
        container = $('#bottomContainer');
        oldTop = container.css('top');
        container.animate({
          top: 0
        });
        if (data) {
          millisecondsUntilStandupEnds = 1000 * 60 * data;
          return setTimeout(function() {
            return container.animate({
              top: oldTop
            });
          }, millisecondsUntilStandupEnds);
        }
      },
      set_url: function(data) {
        storage.setItem("panes." + data.pane, data.url);
        return $("#" + data.pane).attr('src', data.url);
      },
      set_callout: function(data) {
        return $("#topRight").attr('src', data);
      },
      end_standup: function() {
        return $('#bottomContainer').animate({
          top: 270
        });
      }
    };
    _results = [];
    for (event in EventHandlers) {
      if (!__hasProp.call(EventHandlers, event)) continue;
      handler = EventHandlers[event];
      channel.bind(event, handler);
      _results.push(window[event] = handler);
    }
    return _results;
  });
}).call(this);

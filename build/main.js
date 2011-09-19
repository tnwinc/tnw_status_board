(function() {
  var __hasProp = Object.prototype.hasOwnProperty;
  define(["env/localstorage", "env/window", "env/document", "callout"], function(storage, win, doc, callout) {
    var EventHandlers, channel, event, handler, key, pusher, _results;
    $(function() {
      return $("iframe").each(function() {
        var url;
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
        return $('body').fadeOut(function() {
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
        return callout(data);
      },
      close_callout: function() {
        return callout.close();
      },
      end_standup: function() {
        return ($('#bottomContainer')).animate({
          top: 270
        });
      },
      play_sound: function(data) {
        return ($('#radio')).attr({
          src: data
        })[0].play();
      }
    };
    win['pavlov'] = function() {
      return play_sound('http://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg');
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

(function() {
  var __hasProp = {}.hasOwnProperty;

  define(["env/localstorage", "env/window", "env/document", "callout", "frame_manager"], function(LS, win, doc, callout, FrameManager) {
    var EventHandlers, channel, event, frameManager, handler, key, ls, pusher, _results;

    ls = new LS();
    frameManager = new FrameManager();
    if (!(key = ls.get('pusher.api-key'))) {
      key = win.prompt("What is the pusher api key?");
      ls.set('pusher.api-key', key);
    }
    Pusher.log = function(message) {
      return console.log(message);
    };
    pusher = new Pusher(key);
    channel = pusher.subscribe('test_channel');
    EventHandlers = {
      reload_board: function(data) {
        return $('body').fadeOut(function() {
          return win.location.reload();
        });
      },
      start_standup: function(minutes) {
        var container, millisecondsUntilStandupEnds, oldTop, reminderInterval, _fn, _i, _len, _ref;

        console.log("Starting standup for " + minutes + " minutes");
        play_sound("http://soundfxnow.com/soundfx/MilitaryTrumpetTune1.mp3");
        container = $('#bottomContainer');
        oldTop = container.css('top');
        container.animate({
          top: 0
        });
        if (minutes) {
          _ref = [0.75, 0.9, 0.95];
          _fn = function(reminderInterval) {
            var milliseconds;

            milliseconds = 1000 * 60 * reminderInterval * minutes;
            return setTimeout(function() {
              return play_sound("http://soundfxnow.com/soundfx/GameshowBellDing2.mp3");
            }, milliseconds);
          };
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            reminderInterval = _ref[_i];
            console.log("Setting reminder interval for " + (reminderInterval * minutes) + " minutes (" + (reminderInterval * minutes * 60) + " seconds)");
            _fn(reminderInterval);
          }
          millisecondsUntilStandupEnds = 1000 * 60 * minutes;
          return setTimeout(function() {
            return end_standup();
          }, millisecondsUntilStandupEnds);
        }
      },
      set_url: function(data) {
        ls.set("panes." + data.pane, data.url);
        return $("#" + data.pane).attr('src', data.url);
      },
      set_callout: function(data) {
        return callout(data);
      },
      close_callout: function() {
        return callout.close();
      },
      end_standup: function() {
        play_sound("http://soundfxnow.com/soundfx/FamilyFeud-Buzzer3.mp3");
        return $('#bottomContainer').animate({
          top: 270
        });
      },
      play_sound: function(data) {
        return $('#radio').attr({
          src: data
        })[0].play();
      },
      pavlov: function() {
        return play_sound('http://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg');
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

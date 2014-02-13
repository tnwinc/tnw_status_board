(function() {
  var __hasProp = {}.hasOwnProperty;

  require(['localstorage', 'callout', 'pane_manager'], function(LS, callout, PaneManager) {
    var channel, event, eventHandlers, handler, key, ls, paneManager, pusher, _results;

    ls = new LS();
    paneManager = new PaneManager();
    if (!(key = ls.get('pusher.api-key'))) {
      key = prompt('What is the pusher api key?');
      ls.set({
        'pusher.api-key': key
      });
    }
    Pusher.log = function(message) {
      return console.log(message);
    };
    pusher = new Pusher(key);
    channel = pusher.subscribe('test_channel');
    eventHandlers = {
      reload_board: function(data) {
        return $('body').fadeOut(function() {
          return location.reload();
        });
      },
      start_standup: function(minutes) {
        var container, millisecondsUntilStandupEnds, oldTop, reminderInterval, _fn, _i, _len, _ref,
          _this = this;

        console.log("Starting standup for " + minutes + " minutes");
        this.play_sound('http://soundfxnow.com/soundfx/MilitaryTrumpetTune1.mp3');
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
              return _this.play_sound('http://soundfxnow.com/soundfx/GameshowBellDing2.mp3');
            }, milliseconds);
          };
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            reminderInterval = _ref[_i];
            console.log("Setting reminder interval                        for " + (reminderInterval * minutes) + " minutes                        (" + (reminderInterval * minutes * 60) + " seconds)");
            _fn(reminderInterval);
          }
          millisecondsUntilStandupEnds = 1000 * 60 * minutes;
          return setTimeout(function() {
            return end_standup();
          }, millisecondsUntilStandupEnds);
        }
      },
      set_url: function(data) {
        var paneData;

        paneData = {};
        paneData["panes." + data.pane] = data.url;
        ls.set(paneData);
        return $("#" + data.pane).attr('src', data.url);
      },
      set_callout: function(data) {
        return callout(data);
      },
      close_callout: function() {
        return callout.close();
      },
      end_standup: function() {
        this.play_sound('http://soundfxnow.com/soundfx/FamilyFeud-Buzzer3.mp3');
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
        return this.play_sound('http://rpg.hamsterrepublic.com/wiki-images/1/12/Ping-da-ding-ding-ding.ogg');
      }
    };
    _results = [];
    for (event in eventHandlers) {
      if (!__hasProp.call(eventHandlers, event)) continue;
      handler = eventHandlers[event];
      channel.bind(event, handler);
      _results.push(window[event] = handler);
    }
    return _results;
  });

}).call(this);

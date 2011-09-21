(function() {
  var __hasProp = Object.prototype.hasOwnProperty;
  define(["env/window"], function(win) {
    var ContentGenerators, callout, calloutActive, hideCallout, showCallout, timeout;
    calloutActive = false;
    timeout = void 0;
    ContentGenerators = {
      image: {
        pattern: /^(.*\.(?:png|jpg|jpeg|bmp|gif))$/i,
        generator: function(imgSrc) {
          var img;
          img = $('<img src="' + imgSrc + '" style="max-height:100%; max-width:100%" />');
          img.bind('load', function() {
            var largerDimension;
            largerDimension = ($(this)).height() > ($(this)).width() ? "height" : "width";
            return ($(this)).css(largerDimension, "100%");
          });
          pavlov();
          return this(img);
        }
      },
      youtube: {
        pattern: [/youtu\.?be.*?[\/=]([\w\-]{11})/, /^([\w\-]{11})$/],
        generator: function(url, videoId) {
          win.playVideo = function() {
            var player;
            player = new YT.Player('youtube-player', {
              height: '100%',
              width: '100%',
              videoId: videoId,
              events: {
                onReady: function(ev) {
                  return ev.target.playVideo();
                },
                onStateChange: function(ev) {
                  if (ev.data === 0) {
                    return hideCallout();
                  }
                }
              }
            });
            player.setPlaybackQuality('medium');
            return player;
          };
          return this('<div id="youtube-player" /><script type="text/javascript"> window.playVideo(); delete window["playVideo"]; </script>');
        }
      },
      url: {
        pattern: /^(((http|ftp|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/i,
        generator: function(url) {
          if ((url.indexOf('://')) === -1) {
            url = 'http://' + url;
          }
          return this('<iframe src="' + url + '" style="height:100%; width:100%" scrolling="no" frameborder="0" />');
        }
      },
      text: {
        pattern: /^(.*)$/,
        generator: function(content) {
          pavlov();
          return this('<div class="valign">' + content + '</div><div class="vshim" />');
        }
      }
    };
    showCallout = function(data) {
      var callout, contentHandler, def, match, pattern, type, _i, _j, _len, _len2, _ref, _ref2;
      clearTimeout(timeout);
      calloutActive = true;
      callout = ($('#callout')).unbind('webkitTransitionEnd');
      if (data.timeout) {
        timeout = setTimeout(hideCallout, data.timeout * 1000);
      }
      contentHandler = void 0;
      if (data.type) {
        def = ContentGenerators[data.type];
        if (def.pattern instanceof Array) {
          _ref = def.pattern;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pattern = _ref[_i];
            if (match = pattern.test(data.content)) {
              contentHandler = {
                pattern: pattern,
                generator: def.generator
              };
              break;
            }
          }
        } else {
          if (match = def.pattern.test(data.content)) {
            contentHandler = def;
          }
        }
        if (!contentHandler) {
          throw Error("Could not find a suitable regex match for the specified content type '" + data.type + "'");
        }
      } else {
        for (type in ContentGenerators) {
          if (!__hasProp.call(ContentGenerators, type)) continue;
          def = ContentGenerators[type];
          if (def.pattern instanceof Array) {
            _ref2 = def.pattern;
            for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
              pattern = _ref2[_j];
              if (match = pattern.test(data.content)) {
                contentHandler = {
                  pattern: pattern,
                  generator: def.generator
                };
                break;
              }
            }
            if (contentHandler) {
              break;
            }
          } else {
            if (match = def.pattern.test(data.content)) {
              contentHandler = def;
              break;
            }
          }
        }
        if (!contentHandler) {
          throw Error("No content handler was found to match requested content");
        }
      }
      return contentHandler.generator.apply(function(content) {
        return callout.html(content).css({
          '-webkit-transform': 'scale(1)'
        });
      }, contentHandler.pattern.exec(data.content));
    };
    hideCallout = function(onComplete) {
      var callout;
      clearTimeout(timeout);
      return callout = ($('#callout')).unbind('webkitTransitionEnd').css({
        '-webkit-transform': 'scale(0)'
      }).bind('webkitTransitionEnd', function() {
        callout.unbind('webkitTransitionEnd').empty();
        calloutActive = false;
        if (onComplete) {
          return onComplete();
        }
      });
    };
    callout = function(data) {
      if (calloutActive) {
        return hideCallout(function() {
          return showCallout(data);
        });
      }
      return showCallout(data);
    };
    callout.close = function() {
      return hideCallout();
    };
    return callout;
  });
}).call(this);

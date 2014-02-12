(function() {
  var __hasProp = {}.hasOwnProperty;

  define(function() {
    var ContentGenerators, callout, calloutActive, gen, hideCallout, showCallout, timeout, type;

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
          window.playVideo = function() {
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
                  player.setPlaybackQuality('medium');
                  if (ev.data === 0) {
                    return hideCallout();
                  }
                }
              }
            });
            return player;
          };
          return this('<div id="youtube-player" /><script type="text/javascript"> window.playVideo(); delete window["playVideo"]; </script>');
        }
      },
      joinme: {
        pattern: [/^(.*join\.me.*)$/, /\d{3}-\d{3}\d{3}/],
        timeout: 0,
        generator: function(url) {
          if ((url.indexOf('://')) === -1) {
            url = 'https://join.me/' + url;
          }
          return this('<iframe src="' + url + '" style="height:100%; width:100%" scrolling="no" frameborder="0" />');
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
    for (type in ContentGenerators) {
      if (!__hasProp.call(ContentGenerators, type)) continue;
      gen = ContentGenerators[type];
      gen.type = type;
    }
    showCallout = function(data) {
      var callout, contentHandler, def, match, pattern, timeout_val, _i, _j, _len, _len1, _ref, _ref1, _ref2;

      clearTimeout(timeout);
      calloutActive = true;
      callout = ($('#callout')).show();
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
                generator: def.generator,
                type: def.type,
                timeout: def.timeout
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
            _ref1 = def.pattern;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              pattern = _ref1[_j];
              if (match = pattern.test(data.content)) {
                contentHandler = {
                  pattern: pattern,
                  generator: def.generator,
                  type: def.type,
                  timeout: def.timeout
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
      contentHandler.generator.apply(function(content) {
        return callout.html(content);
      }, contentHandler.pattern.exec(data.content));
      timeout_val = ((_ref2 = contentHandler.timeout) != null ? _ref2 : data.timeout) || 0;
      console.log("keeping [" + contentHandler.type + "] callout open for " + timeout_val + " seconds");
      if (timeout_val) {
        return timeout = setTimeout(hideCallout, timeout_val * 1000);
      }
    };
    hideCallout = function(onComplete) {
      var callout;

      clearTimeout(timeout);
      callout = $('#callout');
      callout.empty().hide();
      calloutActive = false;
      if (onComplete) {
        return onComplete();
      }
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

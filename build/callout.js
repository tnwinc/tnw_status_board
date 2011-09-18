var __hasProp = Object.prototype.hasOwnProperty;
define([], function() {
  var ContentGenerators, calloutActive, hideCallout, showCallout, timeout;
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
        return this(img);
      }
    },
    url: {
      pattern: /^(((http|ftp|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)$/i,
      generator: function(url) {
        var iframe;
        if ((url.indexOf('http://')) === -1) {
          url = 'http://' + url;
        }
        iframe = $('<iframe src="' + url + '" style="height:100%; width:100%" scrolling="no" />');
        return this(iframe);
      }
    },
    text: {
      pattern: /^(.*)$/,
      generator: function(content) {
        return this('<div class="valign">' + content + '</div><div class="vshim" />');
      }
    }
  };
  showCallout = function(data) {
    var callout, contentHandler, def, match, type;
    clearTimeout(timeout);
    calloutActive = true;
    callout = ($('#callout')).unbind('webkitTransitionEnd');
    if (data.timeout) {
      timeout = setTimeout(hideCallout, data.timeout * 1000);
    }
    contentHandler = void 0;
    if (data.type) {
      contentHandler = ContentGenerators[data.type];
    } else {
      for (type in ContentGenerators) {
        if (!__hasProp.call(ContentGenerators, type)) continue;
        def = ContentGenerators[type];
        if (match = def.pattern.test(data.content)) {
          contentHandler = def;
          break;
        }
      }
    }
    if (!contentHandler) {
      throw Error("No content handler was found to match requested content");
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
  return function(data) {
    if (calloutActive) {
      return hideCallout(function() {
        return showCallout(data);
      });
    }
    return showCallout(data);
  };
});
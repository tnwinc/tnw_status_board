var __hasProp = Object.prototype.hasOwnProperty;
define([], function() {
  var ContentGenerators, calloutActive, hideCallout, showCallout, timeout;
  calloutActive = false;
  timeout = void 0;
  ContentGenerators = {
    '^(.*\.(?:png|jpg|jpeg|bmp|gif))$': function(imgSrc) {
      return this('<img src="' + imgSrc + '" style="height: 100%; width: 100%" />');
    },
    '^(.*)$': function(content) {
      return this('<div class="valign">' + content + '</div><div class="vshim" />');
    }
  };
  showCallout = function(data) {
    var callout, generator, match, pattern, _results;
    clearTimeout(timeout);
    calloutActive = true;
    callout = ($('#callout')).unbind('webkitTransitionEnd');
    if (data.timeout) {
      timeout = setTimeout(hideCallout, data.timeout * 1000);
    }
    _results = [];
    for (pattern in ContentGenerators) {
      if (!__hasProp.call(ContentGenerators, pattern)) continue;
      generator = ContentGenerators[pattern];
      if (match = new RegExp(pattern, 'igm').exec(data.content)) {
        generator.apply(function(content) {
          return callout.html(content).css({
            '-webkit-transform': 'scale(1)'
          });
        }, match);
        break;
      }
    }
    return _results;
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
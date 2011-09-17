define([], function() {
  var calloutActive, hideCallout, showCallout, timeout;
  calloutActive = false;
  timeout = void 0;
  showCallout = function(data) {
    var callout;
    clearTimeout(timeout);
    calloutActive = true;
    callout = ($('#callout')).unbind('webkitTransitionEnd').html('<div class="valign">' + data.content + '</div><div class="vshim" />').css({
      '-webkit-transform': 'scale(1)'
    });
    if (data.timeout) {
      return timeout = setTimeout(hideCallout, data.timeout * 1000);
    }
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
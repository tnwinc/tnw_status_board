(function () {

  var getParamValue = function (key) {
    var match = location.href.match(new RegExp(key + '=([^&]+)'));
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }
  };

  var format = getParamValue('format') || 'ddd, MMM Do {{h:mm}} a';

  ['color', 'background', 'fontSize'].forEach(function (style) {
    var value = getParamValue(style);
    if (value) {
      document.body.style[style] = value;
    }
  });

  var el = document.getElementById('clock');

  setInterval(function () {
    var dateTime = moment().format(format);
    dateTime = dateTime.replace('{{', '</span><em>');
    dateTime = dateTime.replace('}}', '</em><span>');
    el.innerHTML = '<span>' + dateTime + '</span>';
  }, 1000);

}());

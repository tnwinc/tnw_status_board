(function () {

  ['color', 'background'].forEach(function (style) {
    var match = location.href.match(new RegExp(style + '=([^&]+)'));
    if (match && match[1]) {
      document.body.style[style] = match[1];
    }
  });

  var $ = document.getElementById.bind(document),
      dayShort = $('day-short'),
      dayFull = $('day-full'),
      dateShort = $('date-short'),
      dateFull = $('date-full'),
      hours = $('hours'),
      minutes = $('minutes'),
      ampm = $('ampm');

  setInterval(function () {
    var now = moment();

    dayShort.innerHTML = now.format('ddd,');
    dayFull.innerHTML = now.format('dddd,');
    dateShort.innerHTML = now.format('MMM D');
    dateFull.innerHTML = now.format('MMMM Do');
    hours.innerHTML = now.format('h');
    minutes.innerHTML = now.format('mm');
    ampm.innerHTML = now.format('a');
  }, 1000);

}());

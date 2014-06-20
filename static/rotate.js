(function () {

  var idMatch = location.search.match(/\?.*id\=(\d+)/);
  var LS_KEY = 'rotate-' + (idMatch ? idMatch[1] : '0');

  var data = JSON.parse(localStorage[LS_KEY] || '[]');
  var interval = data.interval || 60000;
  var sites = data.sites || [];

  if (data.showCountdown === false) {
    $('#countdown').hide();
  }

  var index = 0;
  var countdown = $('.countdown');
  var frame = $('iframe');

  var countdown = function () {
    Circles.create({
      id: 'countdown',
      radius: 20,
      value: 360,
      maxValue: 360,
      width: 10,
      text: null,
      colors: ['rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.5)'],
      duration: interval,
      finish: function () {
        update();
      }
    });
  };

  var update = function() {
    var site = sites[index];
    if(!site) {
      index = 0;
      site = sites[index];
    }
    if(site) {
      frame.attr('src', site);
      index++;
    }
    countdown();
  };

  update();

}());

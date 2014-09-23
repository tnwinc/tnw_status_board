(function () {

  var idMatch = location.search.match(/\?.*id\=(\d+)/);
  var LS_KEY = 'rotate-' + (idMatch ? idMatch[1] : '0');

  var DEFAULT_INTERVAL = 60000;

  var data = JSON.parse(localStorage[LS_KEY] || '{}');
  data.interval = data.interval || DEFAULT_INTERVAL;
  data.sites = data.sites || [];
  data.hideCountdown = data.hideCountdown === true ? true : false;

  var index = 0;
  var $countdown = $('#countdown');
  var frame = $('iframe');

  var hideOrShowCountdown = function () {
    $countdown[data.hideCountdown ? 'hide' : 'show']();
  };
  hideOrShowCountdown();

  var countdown;
  var startCountdown = function () {
    countdown = Circles.create({
      id: 'countdown',
      radius: 20,
      value: 360,
      maxValue: 360,
      width: 10,
      text: null,
      colors: ['rgba(0, 0, 0, 0.3)', 'rgba(255, 255, 255, 0.5)'],
      duration: data.interval,
      finish: function () {
        update();
      }
    });
  };

  var update = function() {
    var site = data.sites[index];
    if(!site) {
      index = 0;
      site = data.sites[index];
    }
    if(site) {
      frame.attr('src', site);
      index++;
    }
    startCountdown();
  };

  update();

  var $editor = $('.editor');
  var $sites = $('.sites');
  var $interval = $('.interval input');
  var $hideCountdown = $('.hide-countdown input');

  var siteTemplate = function (site) {
    return [
      '<li>',
        '<input type="text" value="' + (site || '') + '">',
        '<div class="remove">',
          '<i class="fa fa-times"></i>',
        '</div>',
      '</li>'
    ].join('');
  };

  $('.edit').on('click', function () {
    countdown.stop();
    $interval.val(data.interval / 1000);
    $hideCountdown.prop('checked', data.hideCountdown);
    var sitesHtml = data.sites.map(function (site) {
      return siteTemplate(site);
    });
    $sites.html(sitesHtml);
    $editor.show();
  });

  $('.add-site').on('click', function () {
    $(siteTemplate()).appendTo($sites).find('input').focus();
  });

  $sites.on('click', '.remove', function () {
    $(this).closest('li').remove();
  });

  $('.save').on('click', function () {
    data.sites = [];
    $sites.find('input').each(function () {
      var site = $(this).val().trim();
      if (site) {
        data.sites.push(site);
      }
    });

    var interval = $interval.val();
    data.interval = interval ? interval * 1000 : DEFAULT_INTERVAL;
    data.hideCountdown = $hideCountdown.is(':checked');
    hideOrShowCountdown();

    localStorage[LS_KEY] = JSON.stringify(data);

    $editor.hide();
    index = 0;
    update();
  });

}());

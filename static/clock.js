(function () {

  var format = function (units) {
    return '<span class="day-short">' + units.dayShort + ' </span>' +
      '<span class="day-full">' + units.dayFull + ' </span>' +
      '<span class="date-short">' + units.dateShort + ' </span>' +
      '<span class="date-full">' + units.dateFull + ' </span>' +
      '<span class="time">' + units.time + '</span>' +
      '<span class="ampm"> ' + units.ampm + '</span>';
  };

  setInterval(function () {
    var now = moment();
    document.getElementById('clock').innerHTML = format({
      dayShort: now.format('ddd,'),
      dayFull: now.format('dddd,'),
      dateShort: now.format('MMM D'),
      dateFull: now.format('MMMM Do'),
      time: now.format('h:mm'),
      ampm: now.format('a')
    });
  }, 1000);

}());

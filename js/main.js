var chart;
var unit = 1000*60*60*24;
unit = 1000*5;
$(function() {
  chart = Highcharts.chart('chart', {
    chart: {
      type: 'column',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [{
      name: 'Words',
      data: []
    }],
  });

  $('form').submit(function(evt) {
    var counts = JSON.parse(localStorage.getItem('counts'))
    if(!counts) { counts = []; }
    counts.push([new Date().getTime(), parseInt($('#numwords').val())])
    localStorage.setItem('counts', JSON.stringify(counts));

    $('#numwords').val('');

    updateChart();

    evt.preventDefault();
  });
})

function updateChart() {
  var counts = JSON.parse(localStorage.getItem('counts'));
  var perday = {};
  $.each(counts, function(idx, timeval) {
    var day = Math.floor(timeval[0]/unit)
    if(!perday[day] || timeval[1] > perday[day]) {
      perday[day] = timeval[1];
    }
  });
  var daycounts = [];
  $.each(perday, function(day, val) {
    daycounts.push([day*unit, val]);
  });
  chart.series[0].setData(daycounts);
}

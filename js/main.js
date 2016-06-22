var chart;
var unit = 1000*60*60*24;
unit = 1000*5;
$(function() {
  chart = Highcharts.chart('chart', {
    title: {
      text: 'Yer words',
    },
    chart: {
      type: 'column',
    },
    xAxis: {
      type: 'datetime',
    },
    series: [{
      name: 'Words',
      data: []
    }, {
      type: 'line',
      name: 'Goal',
      data: [],
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

  $('#archive').submit(function(evt) {
    var archive_name = $('#archive_name').val();
    archiveChart(archive_name);
    localStorage.setItem('counts', '[]');

    updateChart();
  });

  $('#archive_load').click(function(evt) {
    var archive_name = $('#archive_name').val();
    archiveChart('auto');
    localStorage.setItem('counts', localStorage.getItem('counts_' + archive_name));

    updateChart();
  })

  $('#daily_goal').change(function(evt) {
    updateChart();
  });

  /*
  $('#start').datepicker({
      onClose: function( selectedDate ) {
        $( "#end" ).datepicker( "option", "minDate", selectedDate );
      }
  });
  $('#end').datepicker({
      onClose: function( selectedDate ) {
        $( "#start" ).datepicker( "option", "maxDate", selectedDate );
      }
  });
  */

  updateChart();
})

function archiveChart(archive_name) {
    var archiveList = JSON.parse(localStorage.getItem('archived'));
    if(!archiveList) { archiveList = []; }
    if(archiveList.indexOf(archive_name) == -1) { archiveList.push(archive_name); }
    localStorage.setItem('counts_' + archive_name, localStorage.getItem('counts'));
    localStorage.setItem('archived', JSON.stringify(archiveList));
}

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

  var start = moment($('#start').val());
  var end = moment($('#end').val());
  var span = (end - start);
  chart.series[1].setData([
      [start.valueOf(), 0],
      [end.valueOf(), span/unit*$('#daily_goal').val()]
  ])
}

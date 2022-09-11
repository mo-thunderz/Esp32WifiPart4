var array_length = 10;
var xValues = [];
for (let i = 0; i < array_length; i++) {
  xValues[i] = i;
}

var yValues = [];

const myChart = new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      fill: false,
      lineTension: 0,
      backgroundColor: "rgba(0,0,255,1.0)",
      borderColor: "rgba(0,0,255,0.1)",
      data: yValues
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{ticks: {min: 0, max:10}}],
    }
  }
});

var slider = document.getElementById('ID_RANDOM_INTENSITY');
var output = document.getElementById('ID_RANDOM_INTENSITY_VALUE');
slider.addEventListener('change', slider_changed);

var Socket;

function init() {
  Socket = new WebSocket('ws://' + window.location.hostname + ':81/');
  Socket.onmessage = function(event) {
    processCommand(event);
  };
}

function slider_changed () {
  var l_random_intensity = slider.value;
  console.log(l_random_intensity);
  var msg = { type: "random_intensity", value: l_random_intensity};
  Socket.send(JSON.stringify(msg)); 
}

function processCommand(event) {
  var obj = JSON.parse(event.data);
  var type = obj.type;
  if (type.localeCompare("random_intensity") == 0) { 
    var l_random_intensity = parseInt(obj.value); 
    console.log(l_random_intensity); 
    slider.value = l_random_intensity; 
    output.innerHTML = l_random_intensity;
  }
  else if (type.localeCompare("graph_update") == 0) {
    console.log(obj.value);
    myChart.data.datasets[0].data = obj.value;
    myChart.update();
  }
}
window.onload = function(event) {
  init();
}
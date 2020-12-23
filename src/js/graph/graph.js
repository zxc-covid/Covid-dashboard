import Chart from 'chart.js';

const GraphWrapper = document.querySelector('.graph-wrapper');
const Graph = document.createElement('canvas');
Graph.classList.add('graph');
GraphWrapper.appendChild(Graph);

const GraphControls = document.createElement('div');
GraphControls.classList.add('graph-controls');
GraphWrapper.appendChild(GraphControls);

const RightArrow = document.createElement('button');
RightArrow.classList.add('graph-arrow--right');

const LeftArrow = document.createElement('button');
LeftArrow.classList.add('graph-arrow--left');

const GraphDescription = document.createElement('p');
GraphDescription.classList.add('graph--description');
GraphDescription.innerText = 'Daily cases';

GraphControls.appendChild(LeftArrow);
GraphControls.appendChild(GraphDescription);
GraphControls.appendChild(RightArrow);

const ChartData = [1, 2, 3, 3232, 4000, 10000];
const ChartLabels = ['11.02', '12.02', '13.02', '14.02', '15.02', '16.02'];

const myChart = new Chart(Graph, {
  type: 'line',
  data: {
    labels: ChartLabels,
    datasets: [{
      label: 'cases',
      data: ChartData,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 1,
    }],
  },
  options: {
    tooltips: {
      mode: 'point',
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
        },
      }],
    },
    legend: {
      display: false,
    },
  },
});

setTimeout(() => {
  myChart.data.datasets[0].data.forEach((e) => e * 2);
  myChart.update();
  console.log('w');
}, 2000);

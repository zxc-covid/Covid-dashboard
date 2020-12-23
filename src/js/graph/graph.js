import Chart from 'chart.js';
import moment from 'moment';

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

const ChartData = [];

const chart = new Chart(Graph, {
  type: 'bar',
  data: {
    datasets: [{
      label: 'cases',
      data: ChartData,
      backgroundColor: 'rgba(255, 159, 64, 1)',
      borderColor: 'rgba(255, 159, 64, 1)',
      borderWidth: 0.5,
      barThickness: 2,
    }],
  },
  options: {
    responsive: false,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false,
          maxTicksLimit: 5,
          callback(value) {
            let letter = 'K';
            let number = value;
            if (value >= 1000) {
              letter = 'M';
              number /= 100;
            }
            return `${number}${letter}`;
          },
        },
      }],
      xAxes: [{
        type: 'time',
        time: {
          unit: 'month',
        },
        ticks: {
          fontSize: 8,
          maxTicksLimit: 0,
        },
      }],
    },
    legend: {
      display: false,
    },
  },
});

Graph.style.width = '100%';

const requestOptions = {
  method: 'GET',
};

const APIData = [];
const graphCaption = {
  next: 'Daily deaths',
  previous: 'Daily Recovered',
  current: 'Daily Cases',
  forward() {
    [this.next, this.current, this.previous] = [this.previous, this.next, this.current];
  },
  back() {
    [this.previous, this.current, this.next] = [this.next, this.previous, this.current];
  },
};

const graphMode = {
  next: 'total_deaths',
  previous: 'total_recovered',
  current: 'total_cases',
  forward() {
    [this.next, this.current, this.previous] = [this.previous, this.next, this.current];
    graphCaption.forward();
  },
  back() {
    [this.previous, this.current, this.next] = [this.next, this.previous, this.current];
    graphCaption.back();
  },
};
function updateGrapCaption() {
  GraphDescription.innerText = graphCaption.current;
}

function updateGraph() {
  ChartData.length = 0;
  APIData.forEach((e) => {
    const chunk = {};
    chunk.x = new Date(e.date).toISOString().substring(0, 10);
    chunk.y = parseFloat((e[graphMode.current] / 1e5).toFixed(3));

    ChartData.push(chunk);
  });
  chart.update();
}

function updateData(rawData) {
  rawData.forEach((e) => {
    const chunk = {};
    chunk.date = moment(e.last_update).format();
    chunk.total_cases = e.total_cases;
    chunk.total_deaths = e.total_deaths;
    chunk.total_recovered = e.total_recovered;

    APIData.push(chunk);
  });
  updateGraph();
}

function getGraphData() {
  fetch('https://covid19-api.org/api/timeline', requestOptions)
    .then((response) => response.json())
    .then((data) => updateData(data));
}

function getPreviousGraph() {
  graphMode.back();
  updateGraph();
  updateGrapCaption();
}

function getNextGraph() {
  graphMode.forward();
  updateGraph();
  updateGrapCaption();
}

RightArrow.addEventListener('click', getNextGraph);
LeftArrow.addEventListener('click', getPreviousGraph);

getGraphData();

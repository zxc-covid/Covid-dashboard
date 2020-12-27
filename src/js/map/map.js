/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import leaflet, { circle } from 'leaflet';

const mapMode = {
  last: 'recovered',
  current: 'cases',
  next: 'deaths',
};

const mapWrapper = document.querySelector('.map-wrapper');
const mapContainer = document.getElementById('map');
const mapOptions = {
  center: [41.3775, 64.5853],
  zoom: 2,
};
let map;
function addControls() {
  const mapControls = document.createElement('div');
  mapControls.classList.add('graph-controls');
  mapControls.id = 'map-controls';

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const mapDescription = document.createElement('p');
  mapDescription.classList.add('graph--description');
  mapDescription.innerText = 'Total Cases';

  mapControls.append(LeftArrow, mapDescription, RightArrow);
  mapWrapper.appendChild(mapControls);
}
function appendMap() {
  map = new leaflet.Map(mapContainer, mapOptions);
  new leaflet.TileLayer('https://api.mapbox.com/styles/v1/shaxxkh/ckj1fzzvv4rlp19t7828bld61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hheHhraCIsImEiOiJja2oxOWZsNTEwNGdvMnhwaXc5eXQ0a3RiIn0.SgD1Ef3GQYXxf2P1BpvlUw').addTo(map);
}

function addCircles(lat, long, type, circleColor) {
  const circleCenter = [lat, long];
  const circleOptions = {
    color: circleColor,
    fillOpacity: 1,
  };
  let radius;
  if (type > 1000000) {
    radius = 100000;
  } else if (type > 500000) {
    radius = 70000;
  } else if (type > 250000) {
    radius = 40000;
  } else if (type > 100000) {
    radius = 20000;
  } else if (type > 50000) {
    radius = 10000;
  } else {
    radius = 5000;
  }
  circle(circleCenter, radius, circleOptions).addTo(map);
}

function appendMarkers(countries, type) {
  for (let i = 0; i < countries.length; i += 1) {
    if (type === 'cases') {
      addCircles(countries[i].countryInfo.lat, countries[i].countryInfo.long, countries[i].cases, 'yellow');
    } else if (type === 'deaths') {
      addCircles(countries[i].countryInfo.lat, countries[i].countryInfo.long, countries[i].deaths, 'red');
    } else if (type === 'recovered') {
      addCircles(countries[i].countryInfo.lat, countries[i].countryInfo.long, countries[i].recovered, 'green');
    }
  }
}
function moveForward() {
  const mode = mapMode.current;
  mapMode.current = mapMode.next;
  mapMode.next = mapMode.last;
  mapMode.last = mode;
  document.querySelector('.graph--description').textContent = `Total ${mapMode.current.charAt(0).toUpperCase() + mapMode.current.slice(1)}`;
  map.remove();
  appendMap();
  getData(mapMode.current);
}

function moveBack() {
  const mode = mapMode.current;
  mapMode.current = mapMode.last;
  mapMode.last = mapMode.next;
  mapMode.next = mode;
  document.querySelector('.graph--description').textContent = `Total ${mapMode.current.charAt(0).toUpperCase() + mapMode.current.slice(1)}`;
  map.remove();
  appendMap();
  getData(mapMode.current);
}

function getData(type) {
  fetch('https://disease.sh/v3/covid-19/countries?sort=cases')
    .then((response) => response.json())
    .then((json) => appendMarkers(json, type));
}

addControls();
appendMap();
getData('cases');

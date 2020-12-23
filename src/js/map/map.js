/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-undef */
const mapContainer = document.getElementById('map');
const mapOptions = {
  center: [41.3775, 64.5853],
  zoom: 2,
};
let map;
function appendMap() {
  map = new L.Map(mapContainer, mapOptions);
  new L.TileLayer('https://api.mapbox.com/styles/v1/shaxxkh/ckj1fzzvv4rlp19t7828bld61/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoic2hheHhraCIsImEiOiJja2oxOWZsNTEwNGdvMnhwaXc5eXQ0a3RiIn0.SgD1Ef3GQYXxf2P1BpvlUw').addTo(map);
}

/* function addCircles(lat, lon, cases) {
  const circleCenter = [lat, lon];
  const circleOptions = {
    color: 'red',
    fillColor: 'red',
    fillOpacity: 1,
  };
  let radius;
  if (cases > 1000000) {
    radius = 100000;
  } else {
    radius = 50000;
  }
  const circle = L.circle(circleCenter, radius, circleOptions);
  circle.addTo(map);
} */

/* function asd(countries) {
  for (let i = 0; i < countries.length; i += 1) {
    fetch(`https://api.opencagedata.com/geocode/v1/json?q=${countries[i].Slug}&key=610b62815e424a0784e5ac16906fe367`)
      .then((response) => response.json())
      .then((json) => addCircles(json.results[0].geometry.lat, json.results[0].geometry.lng, countries[i].Confirmed));
  }
} */

/* function getCountries() {
  fetch('https://api.covid19api.com/summary')
    .then((response) => response.json())
    .then((json) => asd(json.Countries));
}

getCountries(); */
appendMap();

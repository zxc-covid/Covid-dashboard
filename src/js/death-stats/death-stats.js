/* eslint-disable no-use-before-define */
const deathsContainer = document.querySelector('.deaths');

const deathsMode = {
  last: { method: appendDeathsPerHundredThousandPeople, api: 'https://disease.sh/v3/covid-19/countries?sort=deaths', type: '100k' },
  current: { method: appendDeathsByCountries, api: 'https://disease.sh/v3/covid-19/countries?yesterday=true&sort=deaths', type: 'global' },
  next: { method: appendLastDayDeaths, api: 'https://disease.sh/v3/covid-19/countries?yesterday=true&sort=todayDeaths', type: 'last-day' },
};

const requestOption = {
  method: 'GET',
};
async function getData(func, api) {
  await fetch(api, requestOption)
    .then((response) => response.json())
    .then((json) => func(json));
}

function addControls(type) {
  const deathsControls = document.createElement('div');
  deathsControls.classList.add('graph-controls');
  deathsControls.id = 'deaths-controls';

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const deathsDescription = document.createElement('p');
  deathsDescription.classList.add('graph--description');

  if (type === 'global') {
    deathsDescription.innerText = 'Total Deaths';
  } else if (type === 'last-day') {
    deathsDescription.innerText = 'Last Day';
  } else if (type === '100k') {
    deathsDescription.innerText = 'Per 100k people';
  }
  deathsControls.append(LeftArrow, deathsDescription, RightArrow);
  deathsContainer.append(deathsControls);
}

async function moveForward() {
  const mode = deathsMode.current;
  deathsMode.current = deathsMode.next;
  deathsMode.next = deathsMode.last;
  deathsMode.last = mode;
  document.querySelector('.deaths__by-countries-container').remove();
  document.getElementById('deaths-controls').remove();
  await getData(deathsMode.current.method, deathsMode.current.api);
  addControls(deathsMode.current.type);
}

async function moveBack() {
  const mode = deathsMode.current;
  deathsMode.current = deathsMode.last;
  deathsMode.last = deathsMode.next;
  deathsMode.next = mode;
  document.querySelector('.deaths__by-countries-container').remove();
  document.getElementById('deaths-controls').remove();
  await getData(deathsMode.current.method, deathsMode.current.api);
  addControls(deathsMode.current.type);
}

function appendLastDayDeaths(countries) {
  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');

  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('deaths__country-container');

    const deathsByCountries = document.createElement('h4');
    deathsByCountries.classList.add('deaths__count-by-countries');
    deathsByCountries.textContent = countries[i].todayDeaths;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('deaths__number-description');
    descriptorOfNumber.textContent = '  deaths';

    const countryName = document.createElement('h4');
    countryName.classList.add('deaths__country-name');
    countryName.textContent = countries[i].country;

    deathsByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(deathsByCountries, countryName);
    deathsByCountriesContainer.append(countryContainer);
  }
  /* document.querySelector('.lds--global-cases').remove(); */
  deathsContainer.append(deathsByCountriesContainer);
}

function appendGlobalDeaths(global) {
  const deathsSubheading = document.createElement('h3');
  deathsSubheading.classList.add('deaths__subheading');
  deathsSubheading.textContent = global.deaths;

  deathsContainer.appendChild(deathsSubheading);
}

function appendDeathsByCountries(countries) {
  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('deaths__country-container');

    const deathsByCountries = document.createElement('h4');
    deathsByCountries.classList.add('deaths__count-by-countries');
    deathsByCountries.textContent = countries[i].deaths;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('deaths__number-description');
    descriptorOfNumber.textContent = '  deaths';

    const countryName = document.createElement('h4');
    countryName.classList.add('deaths__country-name');
    countryName.textContent = countries[i].country;

    deathsByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(deathsByCountries, countryName);
    deathsByCountriesContainer.append(countryContainer);
  }
  deathsContainer.appendChild(deathsByCountriesContainer);
}

function appendDeathsPerHundredThousandPeople(data) {
  const customizedData = [];
  for (let i = 0; i < data.length; i += 1) {
    const deathsPerHundredThousandPeople = {
      country: data[i].country,
      count: (data[i].cases / (data[i].population / 100000)).toFixed(2),
    };
    customizedData.push(deathsPerHundredThousandPeople);
  }

  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');

  for (let i = 0; i < customizedData.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('deaths__country-container');

    const deathsByCountries = document.createElement('h4');
    deathsByCountries.classList.add('deaths__count-by-countries');
    deathsByCountries.textContent = customizedData[i].count;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('deaths__number-description');
    descriptorOfNumber.textContent = '  deaths';

    const countryName = document.createElement('h4');
    countryName.classList.add('deaths__country-name');
    countryName.textContent = customizedData[i].country;

    deathsByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(deathsByCountries, countryName);
    deathsByCountriesContainer.append(countryContainer);
  }
  deathsContainer.append(deathsByCountriesContainer);
}

async function init() {
  await getData(appendGlobalDeaths, 'https://disease.sh/v3/covid-19/all');
  await getData(appendDeathsByCountries, 'https://disease.sh/v3/covid-19/countries?sort=deaths');
  addControls('global');
}

init();

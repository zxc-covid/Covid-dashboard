/* eslint-disable no-use-before-define */
const recoveredContainer = document.querySelector('.recovered');

const requestOption = {
  method: 'GET',
};

const recoveredMode = {
  last: { method: appendRecoveredPerHundredThousandPeople, api: 'https://disease.sh/v3/covid-19/countries?sort=recovered', type: '100k' },
  current: { method: appendRecoveredByCountries, api: 'https://disease.sh/v3/covid-19/countries?sort=recovered', type: 'global' },
  next: { method: appendLastDayRecovered, api: 'https://disease.sh/v3/covid-19/countries?yesterday=true&sort=todayRecovered', type: 'last-day' },
};

async function getData(func, api) {
  await fetch(api, requestOption)
    .then((response) => response.json())
    .then((json) => func(json));
}

function addControls(type) {
  const recoveredControls = document.createElement('div');
  recoveredControls.classList.add('graph-controls');
  recoveredControls.id = 'recovered-controls';

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const recoveredDescription = document.createElement('p');
  recoveredDescription.classList.add('graph--description');

  if (type === 'global') {
    recoveredDescription.innerText = 'Total Recovered';
  } else if (type === 'last-day') {
    recoveredDescription.innerText = 'Last Day';
  } else if (type === '100k') {
    recoveredDescription.innerText = 'Per 100k people';
  }
  recoveredControls.append(LeftArrow, recoveredDescription, RightArrow);
  recoveredContainer.append(recoveredControls);
}

async function moveForward() {
  const mode = recoveredMode.current;
  recoveredMode.current = recoveredMode.next;
  recoveredMode.next = recoveredMode.last;
  recoveredMode.last = mode;
  document.querySelector('.recovered__by-countries-container').remove();
  document.getElementById('recovered-controls').remove();
  await getData(recoveredMode.current.method, recoveredMode.current.api);
  addControls(recoveredMode.current.type);
}

async function moveBack() {
  const mode = recoveredMode.current;
  recoveredMode.current = recoveredMode.last;
  recoveredMode.last = recoveredMode.next;
  recoveredMode.next = mode;
  document.querySelector('.recovered__by-countries-container').remove();
  document.getElementById('recovered-controls').remove();
  await getData(recoveredMode.current.method, recoveredMode.current.api);
  addControls(recoveredMode.current.type);
}

function appendGlobalRecovered(global) {
  const recoveredSubheading = document.createElement('h3');
  recoveredSubheading.classList.add('recovered__subheading');
  recoveredSubheading.textContent = global.recovered;

  recoveredContainer.appendChild(recoveredSubheading);
}

function appendRecoveredByCountries(countries) {
  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');

  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('recovered__country-container');

    const recoveredByCountries = document.createElement('h4');
    recoveredByCountries.classList.add('recovered__count-by-countries');
    recoveredByCountries.textContent = countries[i].recovered;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('recovered__number-description');
    descriptorOfNumber.textContent = '  recovered';

    const countryName = document.createElement('h4');
    countryName.classList.add('recovered__country-name');
    countryName.textContent = countries[i].country;

    recoveredByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(recoveredByCountries, countryName);
    recoveredByCountriesContainer.append(countryContainer);
  }
  recoveredContainer.appendChild(recoveredByCountriesContainer);
}

function appendLastDayRecovered(countries) {
  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');

  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('recovered__country-container');

    const recoveredByCountries = document.createElement('h4');
    recoveredByCountries.classList.add('recovered__count-by-countries');
    recoveredByCountries.textContent = countries[i].todayRecovered;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('recovered__number-description');
    descriptorOfNumber.textContent = '  recovered';

    const countryName = document.createElement('h4');
    countryName.classList.add('recovered__country-name');
    countryName.textContent = countries[i].country;

    recoveredByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(recoveredByCountries, countryName);
    recoveredByCountriesContainer.append(countryContainer);
  }
  /* document.querySelector('.lds--global-cases').remove(); */
  recoveredContainer.append(recoveredByCountriesContainer);
}

function appendRecoveredPerHundredThousandPeople(data) {
  const customizedData = [];
  for (let i = 0; i < data.length; i += 1) {
    const recoveredPerHundredThousandPeople = {
      country: data[i].country,
      count: (data[i].cases / (data[i].population / 100000)).toFixed(2),
    };
    customizedData.push(recoveredPerHundredThousandPeople);
  }

  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');

  for (let i = 0; i < customizedData.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('recovered__country-container');

    const recoveredByCountries = document.createElement('h4');
    recoveredByCountries.classList.add('recovered__count-by-countries');
    recoveredByCountries.textContent = customizedData[i].count;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('recovered__number-description');
    descriptorOfNumber.textContent = '  recovered';

    const countryName = document.createElement('h4');
    countryName.classList.add('recovered__country-name');
    countryName.textContent = customizedData[i].country;

    recoveredByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(recoveredByCountries, countryName);
    recoveredByCountriesContainer.append(countryContainer);
  }
  recoveredContainer.appendChild(recoveredByCountriesContainer);
}

async function init() {
  await getData(appendGlobalRecovered, 'https://disease.sh/v3/covid-19/all');
  await getData(appendRecoveredByCountries, 'https://disease.sh/v3/covid-19/countries?sort=recovered');
  addControls('global');
}

init();

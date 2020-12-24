/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
const deathsContainer = document.querySelector('.deaths');

const deathsMode = {
  last: { method: appendDeathsPerHundredThousandPeople, api: 'https://disease.sh/v3/covid-19/countries?sort=deaths' },
  current: { method: appendGlobalDeaths, api: 'https://api.covid19api.com/summary' },
  next: { method: appendLastDayDeaths, api: 'https://api.covid19api.com/summary' },
};

const requestOption = {
  method: 'GET',
};

function moveForward() {
  const mode = deathsMode.current;
  deathsMode.current = deathsMode.next;
  deathsMode.next = deathsMode.last;
  deathsMode.last = mode;
  document.querySelector('.deaths__subheading').remove();
  document.querySelector('.graph-controls').remove();
  document.querySelector('.deaths__by-countries-container').remove();
  getData(deathsMode.current.method, deathsMode.current.api);
}

function moveBack() {
  const mode = deathsMode.current;
  deathsMode.current = deathsMode.last;
  deathsMode.last = deathsMode.next;
  deathsMode.next = mode;
  document.querySelector('.deaths__subheading').remove();
  document.querySelector('.graph-controls').remove();
  document.querySelector('.deaths__by-countries-container').remove();
  getData(deathsMode.current.method, deathsMode.current.api);
}

function sortCountries(countries, method) {
  if (method === 'TotalDeaths') {
    countries.sort((a, b) => (a.TotalDeaths < b.TotalDeaths ? 1 : -1));
  } else if (method === 'NewDeaths') {
    countries.sort((a, b) => (a.NewDeaths < b.NewDeaths ? 1 : -1));
  }
  return countries;
}

function appendGlobalDeaths(data) {
  const global = data.Global;
  const countries = data.Countries;
  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');

  const deathsSubheading = document.createElement('h3');
  deathsSubheading.classList.add('deaths__subheading');
  deathsSubheading.textContent = global.TotalDeaths;

  const deathsControls = document.createElement('div');
  deathsControls.classList.add('graph-controls');

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const deathsDescription = document.createElement('p');
  deathsDescription.classList.add('graph--description');
  deathsDescription.innerText = 'Total Deaths';
  sortCountries(countries, 'TotalDeaths');
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('deaths__country-container');

    const deathsByCountries = document.createElement('h4');
    deathsByCountries.classList.add('deaths__count-by-countries');
    deathsByCountries.textContent = countries[i].TotalDeaths;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('deaths__number-description');
    descriptorOfNumber.textContent = '  deaths';

    const countryName = document.createElement('h4');
    countryName.classList.add('deaths__country-name');
    countryName.textContent = countries[i].Country;

    deathsByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(deathsByCountries, countryName);
    deathsByCountriesContainer.append(countryContainer);
  }
  deathsControls.append(LeftArrow, deathsDescription, RightArrow);
  deathsContainer.append(deathsSubheading, deathsByCountriesContainer, deathsControls);
}

function appendLastDayDeaths(data) {
  const global = data.Global;
  const countries = data.Countries;
  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');

  const deathsSubheading = document.createElement('h3');
  deathsSubheading.classList.add('deaths__subheading');
  deathsSubheading.textContent = global.NewDeaths;

  const deathsControls = document.createElement('div');
  deathsControls.classList.add('graph-controls');

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const deathsDescription = document.createElement('p');
  deathsDescription.classList.add('graph--description');
  deathsDescription.innerText = 'Last Day';

  sortCountries(countries, 'NewDeaths');
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('deaths__country-container');

    const deathsByCountries = document.createElement('h4');
    deathsByCountries.classList.add('deaths__count-by-countries');
    deathsByCountries.textContent = countries[i].NewDeaths;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('deaths__number-description');
    descriptorOfNumber.textContent = '  deaths';

    const countryName = document.createElement('h4');
    countryName.classList.add('deaths__country-name');
    countryName.textContent = countries[i].Country;

    deathsByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(deathsByCountries, countryName);
    deathsByCountriesContainer.append(countryContainer);
  }
  /* document.querySelector('.lds--global-cases').remove(); */
  deathsControls.append(LeftArrow, deathsDescription, RightArrow);
  deathsContainer.append(deathsSubheading, deathsByCountriesContainer, deathsControls);
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

  const deathsSubheading = document.createElement('h3');
  deathsSubheading.classList.add('deaths__subheading');

  fetch('https://disease.sh/v3/covid-19/all', requestOption)
    .then((response) => response.json())
    .then((json) => {
      document.querySelector('.deaths__subheading').textContent = (json.deaths / (json.population / 100000)).toFixed(2);
    });

  const deathsControls = document.createElement('div');
  deathsControls.classList.add('graph-controls');

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const deathsDescription = document.createElement('p');
  deathsDescription.classList.add('graph--description');
  deathsDescription.innerText = 'Per 100k People';
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
  deathsControls.append(LeftArrow, deathsDescription, RightArrow);
  deathsContainer.append(deathsSubheading, deathsByCountriesContainer, deathsControls);
}

function getData(func, api) {
  fetch(api, requestOption)
    .then((response) => response.json())
    .then((json) => func(json));
}

getData(appendGlobalDeaths, 'https://api.covid19api.com/summary');

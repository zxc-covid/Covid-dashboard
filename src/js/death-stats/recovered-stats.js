/* eslint-disable no-use-before-define */
const recoveredContainer = document.querySelector('.recovered');

const requestOption = {
  method: 'GET',
};

const recoveredMode = {
  last: { method: appendRecoveredPerHundredThousandPeople, api: 'https://disease.sh/v3/covid-19/countries?sort=recovered' },
  current: { method: appendGlobalRecovered, api: 'https://api.covid19api.com/summary' },
  next: { method: appendLastDayRecovered, api: 'https://api.covid19api.com/summary' },
};

function moveForward() {
  const mode = recoveredMode.current;
  recoveredMode.current = recoveredMode.next;
  recoveredMode.next = recoveredMode.last;
  recoveredMode.last = mode;
  document.querySelector('.recovered__subheading').remove();
  document.getElementById('recovered-controls').remove();
  document.querySelector('.recovered__by-countries-container').remove();
  getData(recoveredMode.current.method, recoveredMode.current.api);
}

function moveBack() {
  const mode = recoveredMode.current;
  recoveredMode.current = recoveredMode.last;
  recoveredMode.last = recoveredMode.next;
  recoveredMode.next = mode;
  document.querySelector('.recovered__subheading').remove();
  document.getElementById('recovered-controls').remove();
  document.querySelector('.recovered__by-countries-container').remove();
  getData(recoveredMode.current.method, recoveredMode.current.api);
}

function sortCountries(countries, method) {
  if (method === 'TotalRecovered') {
    countries.sort((a, b) => (a.TotalRecovered < b.TotalRecovered ? 1 : -1));
  } else if (method === 'NewRecovered') {
    countries.sort((a, b) => (a.NewRecovered < b.NewRecovered ? 1 : -1));
  }
  return countries;
}

function appendGlobalRecovered(data) {
  const global = data.Global;
  const countries = data.Countries;
  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');

  const recoveredSubheading = document.createElement('h3');
  recoveredSubheading.classList.add('recovered__subheading');
  recoveredSubheading.textContent = global.TotalRecovered;

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
  recoveredDescription.classList.add('recovered--description');
  recoveredDescription.innerText = 'Total Recovered';

  sortCountries(countries, 'TotalRecovered');
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('recovered__country-container');

    const recoveredByCountries = document.createElement('h4');
    recoveredByCountries.classList.add('recovered__count-by-countries');
    recoveredByCountries.textContent = countries[i].TotalRecovered;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('recovered__number-description');
    descriptorOfNumber.textContent = '  recovered';

    const countryName = document.createElement('h4');
    countryName.classList.add('recovered__country-name');
    countryName.textContent = countries[i].Country;

    recoveredByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(recoveredByCountries, countryName);
    recoveredByCountriesContainer.append(countryContainer);
  }
  recoveredControls.append(LeftArrow, recoveredDescription, RightArrow);
  recoveredContainer.append(recoveredSubheading, recoveredByCountriesContainer, recoveredControls);
}

function appendLastDayRecovered(data) {
  const global = data.Global;
  const countries = data.Countries;
  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');

  const recoveredSubheading = document.createElement('h3');
  recoveredSubheading.classList.add('recovered__subheading');
  recoveredSubheading.textContent = global.NewRecovered;

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
  recoveredDescription.innerText = 'Last Day';

  sortCountries(countries, 'NewRecovered');
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('recovered__country-container');

    const recoveredByCountries = document.createElement('h4');
    recoveredByCountries.classList.add('recovered__count-by-countries');
    recoveredByCountries.textContent = countries[i].NewRecovered;

    const descriptorOfNumber = document.createElement('span');
    descriptorOfNumber.classList.add('recovered__number-description');
    descriptorOfNumber.textContent = '  recovered';

    const countryName = document.createElement('h4');
    countryName.classList.add('recovered__country-name');
    countryName.textContent = countries[i].Country;

    recoveredByCountries.appendChild(descriptorOfNumber);
    countryContainer.append(recoveredByCountries, countryName);
    recoveredByCountriesContainer.append(countryContainer);
  }
  /* document.querySelector('.lds--global-cases').remove(); */
  recoveredControls.append(LeftArrow, recoveredDescription, RightArrow);
  recoveredContainer.append(recoveredSubheading, recoveredByCountriesContainer, recoveredControls);
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

  const recoveredSubheading = document.createElement('h3');
  recoveredSubheading.classList.add('recovered__subheading');

  fetch('https://disease.sh/v3/covid-19/all', requestOption)
    .then((response) => response.json())
    .then((json) => {
      document.querySelector('.recovered__subheading').textContent = (json.recovered / (json.population / 100000)).toFixed(2);
    });

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
  recoveredDescription.innerText = 'Per 100k People';
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
  recoveredControls.append(LeftArrow, recoveredDescription, RightArrow);
  recoveredContainer.append(recoveredSubheading, recoveredByCountriesContainer, recoveredControls);
}

function getData(func, api) {
  fetch(api, requestOption)
    .then((response) => response.json())
    .then((json) => func(json));
}
getData(appendGlobalRecovered, 'https://api.covid19api.com/summary');

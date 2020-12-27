const casesWrapper = document.querySelector('.cases-wrapper');
const regionStatsContainer = document.querySelector('.cases-by-places-wrapper');
const requestOptions = {
  method: 'GET',
};

const regionsMode = {
  last: { api: 'https://disease.sh/v3/covid-19/countries?sort=recovered', type: 'recovered' },
  current: { api: 'https://disease.sh/v3/covid-19/countries?sort=cases', type: 'cases' },
  next: { api: 'https://disease.sh/v3/covid-19/countries?sort=deaths', type: 'deaths' },
};

function moveForward() {
  const mode = regionsMode.current;
  regionsMode.current = regionsMode.next;
  regionsMode.next = regionsMode.last;
  regionsMode.last = mode;
  document.getElementById('cases-by-places').remove();
  document.getElementById('regions-description').textContent = `Total ${regionsMode.current.type[0].toUpperCase() + regionsMode.current.type.slice(1)}`;
  getData(regionsMode.current.api, regionsMode.current.type);
}

function moveBack() {
  const mode = regionsMode.current;
  regionsMode.current = regionsMode.last;
  regionsMode.last = regionsMode.next;
  regionsMode.next = mode;
  document.getElementById('cases-by-places').remove();
  document.getElementById('regions-description').textContent = `Total ${regionsMode.current.type[0].toUpperCase() + regionsMode.current.type.slice(1)}`;
  getData(regionsMode.current.api, regionsMode.current.type);
}
function addControls() {
  const regionsControls = document.createElement('div');
  regionsControls.classList.add('graph-controls');
  regionsControls.id = 'regions-controls';

  const RightArrow = document.createElement('button');
  RightArrow.classList.add('graph-arrow--right');
  RightArrow.addEventListener('click', moveForward);

  const LeftArrow = document.createElement('button');
  LeftArrow.classList.add('graph-arrow--left');
  LeftArrow.addEventListener('click', moveBack);

  const regionsDescription = document.createElement('p');
  regionsDescription.classList.add('graph--description');
  regionsDescription.id = 'regions-description';
  regionsDescription.textContent = 'Total Cases';

  regionsControls.append(LeftArrow, regionsDescription, RightArrow);
  casesWrapper.appendChild(regionsControls);
}
function appendCasesByCountries(countries, type) {
/*   sortByTotalConfirmed(countries); */
  const casesByPlaces = document.createElement('div');
  casesByPlaces.id = 'cases-by-places';
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('cases-container');

    const confirmedCases = document.createElement('span');
    confirmedCases.classList.add('cases-amount');
    if (type === 'cases') {
      confirmedCases.textContent = countries[i].cases;
    } else if (type === 'deaths') {
      confirmedCases.textContent = countries[i].deaths;
    } else if (type === 'recovered') {
      confirmedCases.textContent = countries[i].recovered;
    }

    const countryName = document.createElement('span');
    countryName.classList.add('cases-country');
    countryName.textContent = countries[i].country;

    const flag = document.createElement('img');
    flag.style.marginLeft = '8px';
    flag.style.width = '20px';
    flag.style.height = '12px';
    flag.src = countries[i].countryInfo.flag;

    countryContainer.append(confirmedCases, countryName, flag);
    casesByPlaces.appendChild(countryContainer);
  }
  regionStatsContainer.appendChild(casesByPlaces);
}

function getData(api, type) {
  fetch(api, requestOptions)
    .then((response) => response.json())
    .then((json) => appendCasesByCountries(json, type));
}

document.getElementById('search-country').oninput = function searchCountry() {
  const value = this.value.trim().toLowerCase();
  const countries = document.querySelectorAll('.cases-country');
  countries.forEach((country) => {
    if (value !== '') {
      if (country.textContent.toLowerCase().search(value) === -1) {
        country.parentElement.classList.add('hide');
      } else {
        country.parentElement.classList.remove('hide');
      }
    } else {
      country.parentElement.classList.remove('hide');
    }
  });
};
getData('https://disease.sh/v3/covid-19/countries?sort=cases', 'cases');
addControls();

const deathsContainer = document.querySelector('.deaths');

const requestOption = {
  method: 'GET',
};

function sortByTotalDeaths(countries) {
  countries.sort((a, b) => (a.TotalDeaths < b.TotalDeaths ? 1 : -1));
  return countries;
}

function appendGlobalDeaths(global, countries) {
  const deathsByCountriesContainer = document.createElement('div');
  deathsByCountriesContainer.classList.add('deaths__by-countries-container');
  const deathsSubheading = document.createElement('h3');
  deathsSubheading.classList.add('deaths__subheading');
  deathsSubheading.textContent = global.TotalDeaths;
  sortByTotalDeaths(countries);
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
  document.querySelector('.lds--global-cases').remove();
  deathsContainer.append(deathsSubheading, deathsByCountriesContainer);
}

function getData() {
  fetch('https://api.covid19api.com/summary', requestOption)
    .then((response) => response.json())
    .then((json) => appendGlobalDeaths(json.Global, json.Countries));
}
getData();

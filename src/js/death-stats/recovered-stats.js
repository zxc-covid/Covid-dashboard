const recoveredContainer = document.querySelector('.recovered');

const requestOption = {
  method: 'GET',
};

function sortByTotalRecovered(countries) {
  countries.sort((a, b) => (a.TotalRecovered < b.TotalRecovered ? 1 : -1));
  return countries;
}

function appendGlobalRecovered(global, countries) {
  const recoveredByCountriesContainer = document.createElement('div');
  recoveredByCountriesContainer.classList.add('recovered__by-countries-container');
  const recoveredSubheading = document.createElement('h3');
  recoveredSubheading.classList.add('recovered__subheading');
  recoveredSubheading.textContent = global.TotalRecovered;
  sortByTotalRecovered(countries);
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
  document.querySelector('.lds--global-cases').remove();
  recoveredContainer.append(recoveredSubheading, recoveredByCountriesContainer);
}

function getData() {
  fetch('https://api.covid19api.com/summary', requestOption)
    .then((response) => response.json())
    .then((json) => appendGlobalRecovered(json.Global, json.Countries));
}
getData();

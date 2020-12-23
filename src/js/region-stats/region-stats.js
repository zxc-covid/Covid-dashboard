/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const regionStatsContainer = document.querySelector('.cases-by-places');
const requestOptions = {
  method: 'GET',
};

function sortByTotalConfirmed(countries) {
  countries.sort((a, b) => (a.TotalConfirmed < b.TotalConfirmed ? 1 : -1));
  return countries;
}

function appendTotalCasesByCountries(countries) {
  sortByTotalConfirmed(countries);
  for (let i = 0; i < countries.length; i += 1) {
    const countryContainer = document.createElement('div');
    countryContainer.classList.add('cases-container');
    const confirmedCases = document.createElement('span');
    confirmedCases.classList.add('cases-amount');
    confirmedCases.textContent = countries[i].TotalConfirmed;
    const countryName = document.createElement('span');
    countryName.classList.add('cases-country');
    countryName.textContent = countries[i].Country;
    countryContainer.append(confirmedCases, countryName);
    regionStatsContainer.appendChild(countryContainer);
  }
}

fetch('https://api.covid19api.com/summary', requestOptions)
  .then((response) => response.json())
  // eslint-disable-next-line max-len
  .then((json) => appendTotalCasesByCountries(json.Countries));

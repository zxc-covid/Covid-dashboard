const GlobalCasesWrapper = document.querySelector('.global-cases-wrapper');

const requestOptions = {
  method: 'GET',
  redirect: 'follow',
};

function appendGCasesInfo(info) {
  const GlobalCasesAmount = document.createElement('p');
  GlobalCasesAmount.classList.add('global-cases--amount');
  GlobalCasesAmount.textContent = info;
  document.querySelector('.lds--global-cases').remove();
  GlobalCasesWrapper.appendChild(GlobalCasesAmount);
}

fetch('https://disease.sh/v3/covid-19/all', requestOptions)
  .then((response) => response.text())
  .then((response) => JSON.parse(response))
  .then((result) => {
    appendGCasesInfo(result.cases);
  })
  .catch(() => {
    appendGCasesInfo('error: 0');
  });

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

fetch('https://api.covid19api.com/summary', requestOptions)
  .then((response) => response.text())
  .then((response) => JSON.parse(response))
  .then((result) => {
    appendGCasesInfo(result.Global.TotalConfirmed);
  })
  .catch(() => {
    appendGCasesInfo('error: 0');
  });

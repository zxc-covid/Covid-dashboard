const Developers = document.querySelector('.developers-wrapper');

Developers.addEventListener('click', (e) => {
  if (e.target.className === 'developer') {
    document.location.href = e.target.dataset.link;
  }
});

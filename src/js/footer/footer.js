const Developers = document.querySelector('.footer');

Developers.addEventListener('click', (e) => {
  if (e.target.className === 'developer') {
    document.location.href = e.target.dataset.link;
  }
});

const Footer = document.querySelector('.footer');

Footer.addEventListener('click', (e) => {
  if (e.target.className === 'developer') {
    document.location.href = e.target.dataset.link;
  }
});

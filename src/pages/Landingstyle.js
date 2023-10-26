// script.js
document.addEventListener('DOMContentLoaded', function () {
    const pageScrollLinks = document.querySelectorAll('.page-scroll');
  
    pageScrollLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
  
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
  
        window.scrollTo({
          top: targetElement.offsetTop - 50,
          behavior: 'smooth',
        });
      });
    });
  });
  
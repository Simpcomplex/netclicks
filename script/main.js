const hamburger = document.querySelector('.hamburger');
const tvShows = document.querySelector('.tv-shows');
const tvCard = document.querySelector('.tv-card');
const leftMenu = document.querySelector('.left-menu');
const dropdownList = document.querySelector('.dropdown-list');

// открытие закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open'); 
    }
})

leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');

    if (dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open'); 
    }
})
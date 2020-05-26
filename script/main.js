

const hamburger = document.querySelector('.hamburger');
const leftMenu = document.querySelector('.left-menu');

const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
//const tvCard = document.querySelector('.tv-card');
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
const API_KEY = 'dbd8217291d1853b2f9e91a5d16f1348';

const dropdownList = document.querySelector('.dropdown-list');

const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok){
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}.`)
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }
}
const renderCard = response => {
    
    console.log(response);
    response.results.forEach(item => {
        
        const { backdrop_path: backdrop , name: title, poster_path: poster, vote_average:vote } = item;
        const posterIMG = poster ? IMG_URL+ poster : 'img/no-poster.jpg';
        const backdorIMG = backdrop ? IMG_URL + backdrop : '';
        let voteElem = '';

        if (vote === 0) {
            voteElem = '';
        } else {
            voteElem = `<span class="tv-card__vote">${vote}</span>`;
        }

        const card = document.createElement('li');
        card.classList.add('tv-shows__item');
        card.innerHTML = `
        <a href="#" class="tv-card">
            ${voteElem}
            <img class="tv-card__img"
            src="${posterIMG}"
            data-backdrop="${backdorIMG}"
            alt="Disney Gallery / Star Wars: The Mandalorian">
            <h4 class="tv-card__head">${title}</h4>
        </a>
        `
        tvShowList.append(card);
    })
}


new DBService().getTestData().then(renderCard);


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

//открытие модального окна
tvShowList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');

    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
})

//закрытие модального окна
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') || 
        event.target.classList.contains('modal')){
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
})


//смена карточки
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');
    

    if (card){
        const img = card.querySelector('.tv-card__img');
        //const changeImg = img.dataset.backdrop;
       if (img.dataset.backdrop){
           [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src]
       }
       
        // if (changeImg){
        //img.dataset.backdrop = img.src;
       // img.src = changeImg;
       // }
    }
};

tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);


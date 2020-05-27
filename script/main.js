

const hamburger = document.querySelector('.hamburger');
const leftMenu = document.querySelector('.left-menu');

const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');

const preloader = document.querySelector('.preloader');

const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');

//const tvCard = document.querySelector('.tv-card');
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2/';
const API_KEY = 'dbd8217291d1853b2f9e91a5d16f1348';
const SERVER = 'https://api.themoviedb.org/3';

const tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link');

const dropdownList = document.querySelector('.dropdown-list');

const loading = document.createElement('div');
loading.className = 'loading';

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

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        return this.getData(`${SERVER}/search/tv?api_key=${API_KEY}&query=${query}&language=ru-RU`);
    }

    getTVShow = id => {
        return this.getData(`${SERVER}/tv/${id}?api_key=${API_KEY}&language=ru-RU`);
    }
}


//отрисовка карточки с инфоормацией, полученной с сервера
const renderCard = response => {
    tvShowList.textContent = '';
    console.log(response);
    
    if (response.total_results){ //Если получены данные с сервера
        response.results.forEach(item => {
            //деструктуризация
            const { 
                backdrop_path: backdrop ,
                 name: title, 
                 poster_path: poster, 
                 vote_average:vote,
                 id } = item;
            const posterIMG = poster ? IMG_URL+ poster : 'img/no-poster.jpg';
            const backdorIMG = backdrop ? IMG_URL + backdrop : '';
            
            // если рейтинг фильма 0, то span рейтинга не выводится 
            let voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';
            
            const card = document.createElement('li');
            card.classList.add('tv-shows__item');
            card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                src="${posterIMG}"
                data-backdrop="${backdorIMG}"
                alt="Disney Gallery / Star Wars: The Mandalorian">
                <h4 class="tv-card__head">${title}</h4>
            </a>
            `
            loading.remove();
            tvShowList.append(card);
        }) 
    } else { //если данные с сервера не получены
        loading.remove();
        tvShowList.textContent = 'По Вашему запросу ничего не найдено.'
    }
    
}

//создание обхекта класса подключения к серверу

searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();
    if (value){
        tvShows.append(loading);
        searchFormInput.value = '';
        new DBService().getSearchResult(value).then(renderCard);
    }
    
});
{
    
}

// открытие закрытие меню
hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});
//делегирование клика на левое меню
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
        preloader.style.display = 'flex';
        new DBService().getTVShow(card.id)
            .then(data => {
                console.log(data);
                
                tvCardImg.src = IMG_URL + data.poster_path;
                tvCardImg.alt = data.name;
                modalTitle.textContent = data.name;
                //genresList.innerHTML = data.genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, ''); // в стрелочкной функции return необязателен                
                genresList.textContent = '';
                /*for (const item of data.genres) {
                    
                    genresList.innerHTML += `<li>${item.name}</li>`
                }*/
                data.genres.forEach(item => {
                    genresList.innerHTML += `<li>${item.name}</li>`
                });

                rating.textContent = data.vote_average;
                description.textContent = data.overview;
                modalLink.href = data.homepage;
            })
            .then(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
        
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


//смена карточки при наведении мышки
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


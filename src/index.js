import './sass/main.scss';
import Notiflix from 'notiflix';
import ApiService from '../src/js/ApiService.js';
import Lodash from 'lodash.debounce';

// const BASE_URL = 'https://pixabay.com/api/?key=25003680-e74f6748a2c57625989dee070';
const DEBOUNCE_DELAY = 300;
let startAmount = 40;

const refs = {
  form: document.querySelector('.search-form'),
  galleryBlock: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  submitBtn: document.querySelector('[type="submit"]'),
};

const apiService = new ApiService();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', Lodash(onLoadMore, DEBOUNCE_DELAY));

refs.loadMoreBtn.classList.add('visually-hidden');

function onFormSubmit(e) {
  e.preventDefault();

  clearRequestedInfo();

  apiService.data = e.currentTarget.elements.searchQuery.value.trim();
  if (apiService.data === '') {
    return Notiflix.Notify.failure('Please enter your search query.');
  } 

  apiService.resetPage();
  apiService.fetchCards().then(array => {
    if (array.length === 0) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    }

    renderGalleryCard(array);
    refs.loadMoreBtn.classList.remove('visually-hidden');
    
    if (apiService.page === 2) {
      Notiflix.Notify.success(`Hooray! We found ${apiService.totalHits} images.`);
    }   
    
    // startAmount += array.length;

    if (array.length < 40) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }

  });
}

function onLoadMore() {
  apiService.fetchCards().then(array => {
    renderGalleryCard(array);

    startAmount += array.length;

    if (startAmount === apiService.totalHits) {
      refs.loadMoreBtn.classList.add('visually-hidden');
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
    
  });
}


function foo(array) {
  startAmount += array.length;

  if (startAmount === apiService.totalHits || array.length < 40) {
    refs.loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}



function renderGalleryCard(arrayOfObjects) {
  const markup = arrayOfObjects
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> 
      <span class="quantity">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="quantity">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="quantity">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="quantity">${downloads}</span>
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryBlock.insertAdjacentHTML('beforeend', markup);
}

function clearRequestedInfo() {
  refs.galleryBlock.innerHTML = '';
}

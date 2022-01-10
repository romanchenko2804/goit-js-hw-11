import './sass/main.scss';
import Notiflix from 'notiflix';
import ApiService from '../src/js/ApiService.js';
import Lodash from 'lodash.debounce';

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

  refs.loadMoreBtn.classList.add('visually-hidden');

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

function renderGalleryCard(arrayOfObjects) {
  const markup = arrayOfObjects
    .map(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
      return `<a href="${largeImageURL} class="gallery-link">
      <div class="photo-card">
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
</div>
      </a>`;
    })
    .join('');
  refs.galleryBlock.insertAdjacentHTML('beforeend', markup);
}

function clearRequestedInfo() {
  refs.galleryBlock.innerHTML = '';
}

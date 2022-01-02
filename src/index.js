import './sass/main.scss';
import Notiflix from 'notiflix';
import ApiService from '../src/js/ApiService.js';
import Lodash from 'lodash.debounce';



// const BASE_URL = 'https://pixabay.com/api/?key=25003680-e74f6748a2c57625989dee070';
const DEBOUNCE_DELAY = 300;

const refs = {
  form: document.querySelector('.search-form'),
  galleryBlock: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

const apiService = new ApiService();

refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', Lodash(onLoadMore, DEBOUNCE_DELAY));

// ====> AXIOS <====

// async function onFormSubmit(e) {
//   e.preventDefault();
// e.currentTarget.reset();

// const searchWord = e.srcElement[0].value;
// const searchValue = e.currentTarget.elements.searchQuery.value;

//   // const result = await axios.get(`${BASE_URL}${searchWord}&page=1&`);
//   // console.log(result.data.hits);

// const result = await axios.get(`${BASE_URL}${searchWord}&page=1`, {
//   params: {
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     per_page: 40,
//   },
// });

// const arrayOfObjects = result.data.hits;

// renderGalleryCard(arrayOfObjects);

// console.log(arrayOfObjects);

//   if (result.data.hits.length === 0) {
//     Notiflix.Notify.failure(
//       'Sorry, there are no images matching your search query. Please try again.',
//     );
//   }
// }

function onFormSubmit(e) {
  e.preventDefault();

  clearRequestedInfo();

  apiService.data = e.currentTarget.elements.searchQuery.value;
  if (apiService.data === '') {
    return Notiflix.Notify.failure('Please enter your search query.');
  }

  
  apiService.resetPage();
  apiService.fetchCards().then(renderGalleryCard);
  apiService.fetchCards().then(array => {if (array.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
  }});
}

function onLoadMore() {
  apiService.fetchCards().then(renderGalleryCard);
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
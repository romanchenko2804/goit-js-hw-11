export default class ApiService {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.array;
  }

  

  fetchCards() {
    const url = `https://pixabay.com/api/?key=25003680-e74f6748a2c57625989dee070&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    

    fetch(url)
      .then(resp => resp.json())
      .then(info => {
        this.page += 1;
        this.array = info.hits;
      })
      .catch(err => console.log(err));
  }

  // getArray() {
  //   return array;
  // }

  resetPage() {
    this.page = 1;
  }

  get data() {
    return this.searchValue;
  }

  set data(newData) {
    this.searchValue = newData;
  }

  // get array() {
  //   return this.arrayOfObjects;
  // }

  // set array(newArray) {
  //   this.arrayOfObjects = newArray;
  // }

}

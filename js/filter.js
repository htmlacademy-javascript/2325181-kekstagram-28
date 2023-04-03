import { getRandomPosition } from './util.js';

const RANDOM_PICTURES_COUNT = 10;
const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};
const imageFilter = document.querySelector('.img-filters');
let currentFilter = Filter.DEFAULT;
let pictures = [];

// Функция получения разницы в количестве комментариев для сортировки фотографий
const getCommentsDifference = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

// Функция сортировки фотографий
const getFilteredPictures = () => {
  switch (currentFilter) {
    case Filter.RANDOM:
      return [...pictures].sort(getRandomPosition).slice(0, RANDOM_PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...pictures].sort(getCommentsDifference);
    default:
      return [...pictures];
  }
};

// Функция установки слушателя переключения фильтра фотографий
const setOnFilterClick = (callback) => {
  imageFilter.addEventListener('click', (evt) => {
    const appliedFilter = evt.target;
    if (appliedFilter.classList.contains('img-filters__button') &&
      appliedFilter.id !== currentFilter) {
      imageFilter
        .querySelector('.img-filters__button--active')
        .classList.remove('img-filters__button--active');
      appliedFilter.classList.add('img-filters__button--active');
      currentFilter = appliedFilter.id;
      callback(getFilteredPictures());
    }
  });
};

// Функция включения панели фильтра фотографий
const activateImageFilter = (loadedPictures, callback) => {
  imageFilter.classList.remove('img-filters--inactive');
  pictures = [...loadedPictures];
  setOnFilterClick(callback);
};


export { activateImageFilter };

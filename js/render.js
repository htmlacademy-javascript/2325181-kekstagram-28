import {getDescriptionList} from './data.js';

const renderPictures = function() {
  // Получаем шаблон фотографии
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  // Находим в DOM контейнер для изображений от других пользователей
  const picturesContainer = document.querySelector('.pictures');

  // Генерируем список изображений из data.js
  const descriptionList = getDescriptionList();

  // Создаем фрагмент для хранения фотографий
  const picturesFragment = document.createDocumentFragment();

  // Заполняем данные из списка изображений в элементы фотографий и добавляем элементы во фрагмент
  descriptionList.forEach(({url, likes, comments}) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    picturesFragment.appendChild(pictureElement);
  });

  // Добавляем фрагмент в контейнер DOM
  picturesContainer.appendChild(picturesFragment);
};

export { renderPictures };

const renderPictures = (descriptionList) => {
  // Получаем шаблон фотографии
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  // Находим в DOM контейнер для изображений от других пользователей
  const picturesContainer = document.querySelector('.pictures');

  // Определяем коллекцию прежних фотографий (на случай отрисовки после применения фильтра) и удаляем ее
  const picturesOld = picturesContainer.querySelectorAll('.picture');
  if (picturesOld.length > 0) {
    picturesOld.forEach((picture) => picture.remove());
  }

  // Создаем фрагмент для хранения фотографий
  const picturesFragment = document.createDocumentFragment();

  // Заполняем данные из списка изображений в элементы фотографий и добавляем элементы во фрагмент
  descriptionList.forEach(({id, url, likes, comments, description}) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.dataset.thumbnailId = id;
    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    pictureElement.querySelector('.picture__img').alt = description;
    picturesFragment.appendChild(pictureElement);
  });

  // Добавляем фрагмент в контейнер DOM
  picturesContainer.appendChild(picturesFragment);

};

export { renderPictures };

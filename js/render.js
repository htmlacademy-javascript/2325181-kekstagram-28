const renderPictures = (pictureId) => {
  const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  const picturesContainer = document.querySelector('.pictures');

  const picturesOld = picturesContainer.querySelectorAll('.picture');
  if (picturesOld.length > 0) {
    picturesOld.forEach((picture) => picture.remove());
  }

  const picturesFragment = document.createDocumentFragment();

  pictureId.forEach(({id, url, likes, comments, description}) => {
    const pictureElement = pictureTemplate.cloneNode(true);
    pictureElement.dataset.thumbnailId = id;
    pictureElement.querySelector('.picture__img').src = url;
    pictureElement.querySelector('.picture__likes').textContent = likes;
    pictureElement.querySelector('.picture__comments').textContent = comments.length;
    pictureElement.querySelector('.picture__img').alt = description;
    picturesFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(picturesFragment);

};

export { renderPictures };

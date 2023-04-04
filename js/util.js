// Функция определения нажатия Esc
const isEscapeKey = (evt) => evt.key === 'Escape';

// Функция закрытия по нажатию Esc
const onDocumentEscape = (evt, closingFunction) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closingFunction();
  }
};

// Функция сохранения/получения позиции скролла экрана в момент открытия закрытия полноразмерного фото
const rememberScroll = () => {
  let currentScroll = 0;
  return () => {
    if (window.scrollY || currentScroll) {
      if (currentScroll === 0) {
        currentScroll = window.scrollY;
      } else {
        window.scroll(0, currentScroll);
        currentScroll = 0;
      }
    }
  };
};

// Функция debounce для устранения дребезга:
const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

// Функция получения случайной позиции для сортировки элементов в массиве
const getRandomPosition = () => Math.random() - 0.5;

// Функция проверки выбранного изображения на тип файла
const isImage = (image) => {
  const IMAGE_EXTENTIONS = ['jpg', 'jpeg', 'png'];
  const imageName = image.name.toLowerCase();
  return IMAGE_EXTENTIONS.some((extension) => imageName.endsWith(extension));
};

export {isEscapeKey, rememberScroll, onDocumentEscape, debounce, getRandomPosition, isImage };

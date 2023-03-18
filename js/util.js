// Генератор случайных чисел
const getRandomNumber = (min, max) => {
  const from = Math.ceil(Math.min(min, max));
  const till = Math.floor(Math.max(min, max));
  const result = Math.random() * (till - from + 1) + from;
  return Math.floor(result);
};

// Генератор случайных неповторяющихся чисел
const getRandomId = (min, max) => {
  const idList = [];
  return function () {
    let currentValue = getRandomNumber(min, max);
    while (idList.includes(currentValue)) {
      currentValue = getRandomNumber(min, max);
    }
    idList.push(currentValue);
    return currentValue;
  };
};

// Генератор случайного индекса массива
const getRandomArrayElement = (arrayInput) => arrayInput[getRandomNumber(0, arrayInput.length - 1)];

// Функция определения нажатия Esc
const isEscapeKey = (evt) => evt.key === 'Escape';

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


export { getRandomNumber, getRandomId, getRandomArrayElement, isEscapeKey, rememberScroll };

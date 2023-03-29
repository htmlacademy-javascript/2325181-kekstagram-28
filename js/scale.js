const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imageUploadPreview = document.querySelector('.img-upload__preview');

// Функция применения масштаба
const setPhotoscale = (value) => {
  imageUploadPreview.style.transform = `scale(${value / 100})`;
  scaleControlValue.value = `${value}%`;
};

// Функция изменения масштаба
const updateScale = (changeSign) => {
  const actualScale = parseInt(scaleControlValue.value, 10);
  const newScale = actualScale + SCALE_STEP * changeSign;
  if (newScale > MAX_SCALE || newScale < MIN_SCALE) {
    return actualScale;
  }
  return newScale;
};

// Обработчик нажатия на кнопку уменьшения масшатаба
const onSmallerButtonClick = () => setPhotoscale(updateScale(-1));

// Обработчик нажатия на кнопку увеличения масшатаба
const onBiggerButtonClick = () => setPhotoscale(updateScale(1));

// Функция включения управления масштабированием
const addManageScale = () => {
  scaleControlSmaller.addEventListener('click', onSmallerButtonClick);
  scaleControlBigger.addEventListener('click', onBiggerButtonClick);
};

// Функция сброса параметров масштабирования
const resetScale = () => {
  setPhotoscale(DEFAULT_SCALE);
  scaleControlSmaller.removeEventListener('click', onSmallerButtonClick);
  scaleControlBigger.removeEventListener('click', onBiggerButtonClick);
};

export { resetScale, addManageScale };

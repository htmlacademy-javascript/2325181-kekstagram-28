const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;
const BIGGER_SCALE = 1;
const SMALLER_SCALE = -1;

const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');
const imageUploadPreview = document.querySelector('.img-upload__preview img');

const setPhotoscale = (value) => {
  imageUploadPreview.style.transform = `scale(${value / MAX_SCALE})`;
  scaleControlValue.value = `${value}%`;
};

const updateScale = (changeSign) => {
  const actualScale = parseInt(scaleControlValue.value, 10);
  const newScale = actualScale + SCALE_STEP * changeSign;
  if (newScale > MAX_SCALE || newScale < MIN_SCALE) {
    return actualScale;
  }
  return newScale;
};

const onSmallerButtonClick = () => setPhotoscale(updateScale(SMALLER_SCALE));

const onBiggerButtonClick = () => setPhotoscale(updateScale(BIGGER_SCALE));

const addManageScale = () => {
  scaleControlSmaller.addEventListener('click', onSmallerButtonClick);
  scaleControlBigger.addEventListener('click', onBiggerButtonClick);
};

const resetScale = () => {
  setPhotoscale(DEFAULT_SCALE);
  scaleControlSmaller.removeEventListener('click', onSmallerButtonClick);
  scaleControlBigger.removeEventListener('click', onBiggerButtonClick);
};

export { resetScale, addManageScale };

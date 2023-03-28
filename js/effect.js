const EFFECTS = {
  none: [0, 100, 1, 'none', ''],
  chrome: [0, 1, 0.1, 'grayscale', ''],
  sepia: [0, 1, 0.1, 'sepia', ''],
  marvin: [ 0, 100, 1,'invert','%'],
  phobos: [0, 3, 0.1, 'blur', 'px'],
  heat: [1, 3, 0.1, 'brightness', '']
};

let appliedEffect = 'none';
const imageUploadPreview = document.querySelector('.img-upload__preview img');
const imageUploadEffects = document.querySelector('.img-upload__effects');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const imageUploadEffectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');

//Функция конфигурирования слайдера
const configureSlider = (effect) => {
  const [rangeMin, rangeMax, rangeStep] = EFFECTS[effect];
  const sliderConfiguration = {
    range: {
      min: rangeMin,
      max: rangeMax,
    },
    start: rangeMax,
    step: rangeStep,
    connect: 'lower',
  };
  return sliderConfiguration;
};

// Функция сброса эффектов
const resetEffects = () => {
  imageUploadPreview.className = '';
  imageUploadPreview.style = '';
  imageUploadEffectLevel.classList.add('hidden');
};

//Функция обновления параметров слайдера
const updateSlider = (effect) => effectLevelSlider.noUiSlider.updateOptions(configureSlider(effect));

// Обработчик смены эффекта
const onEffectsChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  appliedEffect = evt.target.value;
  if (appliedEffect === 'none') {
    resetEffects();
  } else {
    imageUploadPreview.className = `effects__preview--${EFFECTS[appliedEffect][3]}`;
    imageUploadEffectLevel.classList.remove('hidden');
    updateSlider(appliedEffect);
  }
};

// Обработчик изменения значений слайдера
const onSliderUpdate = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  imageUploadPreview.style.filter = `${EFFECTS[appliedEffect][3]}(${sliderValue}${EFFECTS[appliedEffect][4]})`;
  effectLevelValue.value = sliderValue;
};

// Функция создания слайдера
const createSlider = () => {
  noUiSlider.create(effectLevelSlider, configureSlider('none'));
  resetEffects();
  imageUploadEffects.addEventListener('change', onEffectsChange);
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
};

// Функция удаления слайдера
const removeSlider = () => {
  resetEffects();
  appliedEffect = 'none';
  document.querySelector('#effect-none').checked = true;
  imageUploadEffects.removeEventListener('change', onEffectsChange);
  effectLevelSlider.noUiSlider.destroy();
};

export { resetEffects, removeSlider, createSlider };

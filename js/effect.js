const EffectStyle = {
  NONE: [0, 100, 1, 'none', ''],
  CHROME: [0, 1, 0.1, 'grayscale', ''],
  SEPIA: [0, 1, 0.1, 'sepia', ''],
  MARVIN: [ 0, 100, 1,'invert','%'],
  PHOBOS: [0, 3, 0.1, 'blur', 'px'],
  HEAT: [1, 3, 0.1, 'brightness', '']
};

let appliedEffect = 'NONE';
const imageUploadPreview = document.querySelector('.img-upload__preview img');
const imageUploadEffects = document.querySelector('.img-upload__effects');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const imageUploadEffectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelValue = document.querySelector('.effect-level__value');
const EFFECT_VALUE_INDEX = 3;
const UNITS_INDEX = 4;

const configureSlider = (effect) => {
  const [rangeMin, rangeMax, rangeStep] = EffectStyle[effect];
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

const resetEffects = () => {
  imageUploadPreview.className = '';
  imageUploadPreview.style.filter = '';
  imageUploadEffectLevel.classList.add('hidden');
};

const updateSlider = (effect) => effectLevelSlider.noUiSlider.updateOptions(configureSlider(effect));

const onEffectsChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  appliedEffect = evt.target.value.toUpperCase();
  if (appliedEffect === 'NONE') {
    resetEffects();
  } else {
    imageUploadPreview.className = `effects__preview--${EffectStyle[appliedEffect][EFFECT_VALUE_INDEX]}`;
    imageUploadEffectLevel.classList.remove('hidden');
    updateSlider(appliedEffect);
  }
};

const onSliderUpdate = () => {
  const sliderValue = effectLevelSlider.noUiSlider.get();
  imageUploadPreview.style.filter = `${EffectStyle[appliedEffect][EFFECT_VALUE_INDEX]}(${sliderValue}${EffectStyle[appliedEffect][UNITS_INDEX]})`;
  effectLevelValue.value = sliderValue;
};

const createSlider = () => {
  noUiSlider.create(effectLevelSlider, configureSlider('NONE'));
  resetEffects();
  imageUploadEffects.addEventListener('change', onEffectsChange);
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
};

const removeSlider = () => {
  resetEffects();
  appliedEffect = 'NONE';
  document.querySelector('#effect-none').checked = true;
  imageUploadEffects.removeEventListener('change', onEffectsChange);
  effectLevelSlider.noUiSlider.destroy();
};

export { resetEffects, removeSlider, createSlider };

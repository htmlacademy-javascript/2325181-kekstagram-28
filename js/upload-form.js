import {createSlider, removeSlider} from './effect.js';
import {resetScale, addManageScale} from './scale.js';
import {onDocumentEscape, isImage} from './util.js';
import {postData} from './api.js';

const SUCCESS_MESSAGE_PARAMETERS = [
  '#success',
  '.success',
  '.success__title',
  'Ваше фото добавлено в галерею',
  '.success__button',
  'Отлично',
  '.success__inner',
  true
];

const ERROR_MESSAGE_PARAMETERS = [
  '#error',
  '.error',
  '.error__title',
  'Произошли ошибки во время загузки. Попробуйте еще раз.',
  '.error__button',
  'Понятно',
  '.error__inner',
  true
];

const GET_DATA_ERROR_MESSAGE_PARAMETERS = [
  '#error',
  '.error',
  '.error__title',
  'Нет связи с сервером. Попробуйте перезагрузить страницу.',
  '.error__button',
  'Понятно',
  '.error__inner',
  false
];

// Элементы формы загрузки изображения, константы регулярных выражений и количества для проверки хэштегов
const MAX_HASHTAG_COUNT = 5;
const REGEX_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
const fileUploadInput = document.querySelector('#upload-file');
const uploadForm = document.querySelector('#upload-select-image');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const submitButton = uploadOverlay.querySelector('.img-upload__submit');
const textHashtags = uploadOverlay.querySelector('.text__hashtags');
const textDescription = uploadOverlay.querySelector('.text__description');
const uploadCancelButton = uploadOverlay.querySelector('.img-upload__cancel');
let objectUrl;
const uploadPreview = uploadOverlay
  .querySelector('.img-upload__preview')
  .querySelector('img');

// Функция сброса значений полей формы
const resetFormFields = () => {
  fileUploadInput.value = '';
  textHashtags.value = '';
  textDescription.value = '';
};

// Конструктор Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper__error',
}, true);

// Функция закрытия формы редактирования изображения
const closeUploadOverlay = () => {
  resetScale();
  resetFormFields();
  removeSlider();
  pristine.reset();
  URL.revokeObjectURL(objectUrl);
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onOverlayEscape);
  uploadForm.removeEventListener('submit', submitForm);
};

// Обработчик закрытия формы редактирования изображения по нажатию кнопки Х
const onUploadCancelClick = () => closeUploadOverlay();

// Функция проверки фокуса на текстовой части формы редактирования
const isTextFieldFocused = () =>
  document.activeElement === textHashtags ||
  document.activeElement === textDescription;

// Обработчик выхода из формы редактирования по нажатию Escape
function onOverlayEscape(evt) {
  if (!isTextFieldFocused()) {
    onDocumentEscape(evt, onUploadCancelClick);
  }
}

// Функция отображения сообщения о статусе отправки формы
const showStatusMessage = (
  messageTemplateId,
  messageTemplateClass,
  messageTitle,
  messageTitleText,
  messageButtonClass,
  messageButtonText,
  messageInnerClass,
  postDataError
) => {
  const messageTemplate = document.querySelector(messageTemplateId).content.querySelector(messageTemplateClass);
  const statusMessage = messageTemplate.cloneNode(true);
  const statusTitle = statusMessage.querySelector(messageTitle);
  statusTitle.textContent = messageTitleText;
  statusTitle.style.lineHeight = '1.5em';
  statusTitle.style.fontSize = '30px';
  const statusButton = statusMessage.querySelector(messageButtonClass);
  statusButton.textContent = messageButtonText;
  document.body.appendChild(statusMessage);
  const onStatusMessageOutClick = (evt) => {
    if (!evt.target.closest(messageInnerClass)) {
      closeStatusMessage();
    }
  };
  function closeStatusMessage () {
    statusMessage.classList.add('hidden');
    if (messageTemplate.classList.contains('error') && postDataError) {
      document.addEventListener('keydown', onOverlayEscape);
    }
    statusMessage.removeEventListener('click', onStatusMessageOutClick);
  }
  statusMessage.addEventListener('click', onStatusMessageOutClick);
  statusButton.addEventListener('click', closeStatusMessage, {once: true});
  document.addEventListener('keydown', (evt) => {
    onDocumentEscape(evt, closeStatusMessage);
  }, {once: true});
};

// Функция отображения сообщения об ошибке загрузки данных с сервера
const getDataErrorMessageParameters = () => showStatusMessage(...GET_DATA_ERROR_MESSAGE_PARAMETERS);

// Функция получения массива хэштегов
const getArrayOfHashTags = (value) => value.trim().split(' ').filter((hashTag) => hashTag.trim().length);

// Функция проверки уникальности хэштегов без учета регистра
const areHashTagsUnique = (value) => {
  const hashTags = getArrayOfHashTags(value);
  const lowerCaseHashTags = hashTags.map((hashTag) => hashTag.toLowerCase());
  return lowerCaseHashTags.length === new Set(lowerCaseHashTags).size;
};

// Функция проверки хэштегов на соответствие формату и длине
const areHashTagsValid = (value) => {
  if (value.length > 0) {
    const hashTags = getArrayOfHashTags(value);
    return hashTags.every((hashTag) => REGEX_HASHTAG.test(hashTag));
  }
  return true;
};

// Функция проверки количества введенных хэштегов
const hasValidCount = (value) => getArrayOfHashTags(value).length <= MAX_HASHTAG_COUNT;

// Функция проверки длины поля комментария
const checkDescriptionLength = (value) => value.length <= 140;

// Валидаторы Pristine по количеству, формату, длине, уникальности хэштегов
pristine.addValidator(textHashtags, areHashTagsUnique, 'Один и тот же хэш-тег не может быть использован дважды');
pristine.addValidator(textHashtags, areHashTagsValid, 'Максимальная длина одного хэш-тега 20 символов, включая решётку. Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.');
pristine.addValidator(textHashtags, hasValidCount, 'нельзя указать больше пяти хэш-тегов');
pristine.addValidator(textDescription, checkDescriptionLength, 'Длина комментария не может составлять более 140 символов.');

// Обработчик выбора файла для загрузки
const onUploadFileSelect = () => {
  const image = fileUploadInput.files[0];
  objectUrl = URL.createObjectURL(image);
  if (!isImage(image)) {
    return;
  }
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  uploadPreview.src = objectUrl;
  uploadPreview.alt = 'Моя фотография';
  document.addEventListener('keydown', onOverlayEscape);
  uploadCancelButton.addEventListener('click', onUploadCancelClick, {once: true});
  uploadForm.addEventListener('submit', submitForm);
  addManageScale();
  createSlider();
};

// Функция блокировки кнопки отправки формы
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'ПУБЛИКУЕМ...';
};

// Функция разблокировки кнопки отправки формы
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'ОПУБЛИКОВАТЬ';
};

// Функция отправки формы на сервер (на данный момент только валидация)
function submitForm(evt) {
  evt.preventDefault();
  if (pristine.validate()) {
    blockSubmitButton();
    postData(new FormData(evt.target))
      .then(() => {
        showStatusMessage(...SUCCESS_MESSAGE_PARAMETERS);
        closeUploadOverlay();
      })
      .catch(() => {
        document.removeEventListener('keydown', onOverlayEscape);
        showStatusMessage(...ERROR_MESSAGE_PARAMETERS);
      })
      .finally(unblockSubmitButton);
  }
}

// Обработчик открытия формы редактирования изображения по выбору файла для загрузки
fileUploadInput.addEventListener('change', onUploadFileSelect);

export { getDataErrorMessageParameters };

import {createSlider, removeSlider} from './effect.js';
import {resetScale, addManageScale} from './scale.js';
import {onDocumentEscape} from './util.js';


const SUCCESS_MESSAGE_PARAMETERS = [
  '#success',
  '.success',
  '.success__title',
  'Ваше фото добавлено в галерею',
  '.success__button',
  'Отлично',
  '.success__inner'
];

const ERROR_MESSAGE_PARAMETERS = [
  '#error',
  '.error',
  '.error__title',
  'Произошли ошибки во время загузки',
  '.error__button',
  'Понятно',
  '.error__inner'
];

const uploadPhoto = () => {

  // Элементы формы загрузки изображения, константы регулярных выражений и количества для проверки хэштегов
  const MAX_HASHTAG_COUNT = 5;
  const REGEX_HASHTAG = /^#[a-zа-яё0-9]{1,19}$/i;
  const uploadFile = document.querySelector('#upload-file');
  const uploadForm = document.querySelector('#upload-select-image');
  const uploadOverlay = document.querySelector('.img-upload__overlay');
  const textHashtags = uploadOverlay.querySelector('.text__hashtags');
  const textDescription = uploadOverlay.querySelector('.text__description');
  const uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
  const uploadPreview = uploadOverlay
    .querySelector('.img-upload__preview')
    .querySelector('img');

  // Функция сброса значений полей формы
  const resetFormFields = () => {
    uploadFile.value = '';
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
    messageInnerClass
  ) => {
    const messageTemplate = document.querySelector(messageTemplateId).content.querySelector(messageTemplateClass);
    const statusMessage = messageTemplate.cloneNode(true);
    const statusTitle = statusMessage.querySelector(messageTitle);
    statusTitle.textContent = messageTitleText;
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
      statusMessage.removeEventListener('click', onStatusMessageOutClick);
    }
    statusMessage.addEventListener('click', onStatusMessageOutClick);
    statusButton.addEventListener('click', closeStatusMessage, {once: true});
    document.addEventListener('keydown', (evt) => {
      onDocumentEscape(evt, closeStatusMessage);
      if (messageTemplate.classList.contains('.error')) {
        document.addEventListener('keydown', onOverlayEscape, {once: true});
      }
    }, {once: true});
  };

  // Функция получения массива хэштегов
  const getArrayOfHashTags = (value) => value.trim().split(' ').filter((hashTag) => hashTag.trim().length);

  // Функция проверки уникальности хэштегов без учета регистра
  const uniqueHashTags = (value) => {
    const hashTags = getArrayOfHashTags(value);
    const lowerCaseHashTags = hashTags.map((hashTag) => hashTag.toLowerCase());
    return lowerCaseHashTags.length === new Set(lowerCaseHashTags).size;
  };

  // Функция проверки хэштегов на соответствие формату и длине
  const everyHashTagValid = (value) => {
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
  pristine.addValidator(textHashtags, uniqueHashTags, 'Один и тот же хэш-тег не может быть использован дважды');
  pristine.addValidator(textHashtags, everyHashTagValid, 'Максимальная длина одного хэш-тега 20 символов, включая решётку. Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.');
  pristine.addValidator(textHashtags, hasValidCount, 'нельзя указать больше пяти хэш-тегов');
  pristine.addValidator(textDescription, checkDescriptionLength, 'Длина комментария не может составлять более 140 символов.');

  // Обработчик выбора файла для загрузки
  const onUploadFileSelect = () => {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    uploadPreview.src = URL.createObjectURL(uploadFile.files[0]);
    uploadPreview.alt = 'Моя фотография';
    document.addEventListener('keydown', onOverlayEscape);
    uploadCancel.addEventListener('click', onUploadCancelClick, {once: true});
    uploadForm.addEventListener('submit', submitForm);
    addManageScale();
    createSlider();
  };

  // Функция отправки формы на сервер (на данный момент только валидация)
  function submitForm(evt) {
    evt.preventDefault();
    pristine.validate();
    const isValid = pristine.validate();
    if (isValid) {
      closeUploadOverlay();
      //uploadForm.submit();
      showStatusMessage(...SUCCESS_MESSAGE_PARAMETERS);
    } else {
      document.removeEventListener('keydown', onOverlayEscape);
      showStatusMessage(...ERROR_MESSAGE_PARAMETERS);
    }
  }

  // Обработчик открытия формы редактирования изображения по выбору файла для загрузки
  uploadFile.addEventListener('change', onUploadFileSelect);

};

export { uploadPhoto };

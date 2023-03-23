import {onDocumentEscape} from './util.js';

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

  // Функция закрытия формы редактирования изображения
  const closeOverlay = () => {
    resetFormFields();
    uploadOverlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', escapeOverlay);
    uploadForm.removeEventListener('submit', submitForm);
  };

  // Функция проверки фокуса на текстовой части формы редактирования
  const isTextFieldFocused = () =>
    document.activeElement === textHashtags ||
    document.activeElement === textDescription;

  // Функция выхода из формы редактирования по нажатию Escape
  function escapeOverlay(evt) {
    if (!isTextFieldFocused()) {
      onDocumentEscape(evt, closeOverlay);
    }
  }

  // Функция закрытия сообщения
  const closeMessage = (messageBox) => messageBox.classList.add('hidden');

  // Функция отображения сообщения об успешной загрузке фотографии
  const showSuccessMessage = () => {
    const successMessageTemplate = document.querySelector('#success')
      .content.querySelector('.success');
    const successMessage = successMessageTemplate.cloneNode(true);
    const successTitle = successMessage.querySelector('.success__title');
    successTitle.textContent = 'Ваше фото добавлено в галерею';
    const successButton = successMessage.querySelector('.success__button');
    successButton.textContent = 'Отлично';
    document.body.appendChild(successMessage);
    const closeSuccessMessage = () => closeMessage(successMessage);
    document.addEventListener('keydown', (evt) => onDocumentEscape(evt, closeSuccessMessage), {once: true});
    successButton.addEventListener('click', () => closeMessage(successMessage), {once: true});
  };

  // Функция отображения сообщения об ошибке
  const showErrorMessage = () => {
    const errorMessageTemplate = document.querySelector('#error')
      .content.querySelector('.error');
    const errorMessage = errorMessageTemplate.cloneNode(true);
    const errorTitle = errorMessage.querySelector('.error__title');
    errorTitle.textContent = 'Произошли ошибки во время загузки';
    const errorButton = errorMessage.querySelector('.error__button');
    errorButton.textContent = 'Понятно';
    document.body.appendChild(errorMessage);
    const closeErrorMessage = () => closeMessage(errorMessage);
    document.removeEventListener('keydown', escapeOverlay);
    errorButton.addEventListener('click', closeErrorMessage, {once: true});
    document.addEventListener('keydown', (evt) => {
      onDocumentEscape(evt, closeErrorMessage);
      document.addEventListener('keydown', escapeOverlay, {once: true});
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

  // Конструктор Pristine
  const pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextClass: 'img-upload__field-wrapper__error',
  }, true);

  // Валидаторы Pristine по количеству, формату, длине, уникальности хэштегов
  pristine.addValidator(textHashtags, uniqueHashTags, 'Один и тот же хэш-тег не может быть использован дважды');
  pristine.addValidator(textHashtags, everyHashTagValid, 'Максимальная длина одного хэш-тега 20 символов, включая решётку. Строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.');
  pristine.addValidator(textHashtags, hasValidCount, 'нельзя указать больше пяти хэш-тегов');
  pristine.addValidator(textDescription, checkDescriptionLength, 'Длина комментария не может составлять более 140 символов.');

  // Функция открытия формы редактирования изображения
  const openOverlay = () => {
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    uploadPreview.src = URL.createObjectURL(uploadFile.files[0]);
    uploadPreview.alt = textDescription.textContent;
    document.addEventListener('keydown', escapeOverlay);
    uploadCancel.addEventListener('click', closeOverlay, {once: true});
    pristine.validate();
    uploadForm.addEventListener('submit', submitForm);
  };

  // Функция отправки формы на сервер (на данный момент только валидация)
  function submitForm(evt) {
    evt.preventDefault();
    pristine.validate();
    const isValid = pristine.validate();
    if (isValid) {
      showSuccessMessage();
      resetFormFields();
      closeOverlay();
    } else {
      showErrorMessage();
    }
  }

  // Обработчик открытия формы редактирования изображения по выбору файла для загрузки
  uploadFile.addEventListener('change', openOverlay);

};

export { uploadPhoto };

import {rememberScroll, onDocumentEscape} from './util.js';

// Количество загружаемых комментариев в полноразмерном изображении
const COMMENTS_NEW_UPLOAD = 5;

const showBigPicture = (descriptionList) => {

  // Элементы полноэкранного изображения, открываемой миниатюры, переменные количества лайков, комментариев и элемента события
  const bigPicture = document.querySelector('.big-picture');
  const bigPicturePreview = bigPicture.querySelector('.big-picture__preview');
  const bigPictureImg = bigPicturePreview.querySelector('.big-picture__img')
    .querySelector('img');
  const bigPictureCaption = bigPicturePreview.querySelector('.social__caption');
  const bigPictureLikes = bigPicturePreview.querySelector('.likes-count');
  const bigPictureReset = bigPicturePreview.querySelector('.big-picture__cancel');
  const bigPictureSocialComments = bigPicturePreview.querySelector('.social__comment-count');
  const bigPictureCommentsLoader = bigPicturePreview.querySelector('.comments-loader');
  const bigPictureCommentTemplate = bigPicturePreview.querySelector('.social__comment');
  const bigPictureCommentsList = bigPicturePreview.querySelector('.social__comments');
  let bigPictureTotalComments;
  let targetNode;
  let pictureId;

  // Функция скрытия кнопки загрузки дополнительных комментариев
  const toggleCommentsLoader = () => {
    if (bigPictureCommentsList.lastElementChild.classList.contains('hidden')) {
      bigPictureCommentsLoader.classList.remove('hidden');
    } else {
      bigPictureCommentsLoader.classList.add('hidden');
    }
  };

  // Функция удаления списка комментариев
  const removeComments = () => {
    bigPicturePreview.querySelectorAll('.social__comment').forEach((comment) => comment.remove());
  };

  // Функция отображения количества комментариев в полноэкранном изображении
  const setCommentsCount = (shown) => {
    bigPictureSocialComments.textContent = '';
    const newSpan = document.createElement('span');
    newSpan.classList.add('comments-count');
    newSpan.textContent = `${bigPictureTotalComments}`;
    bigPictureSocialComments.append(`${shown} из `, newSpan, ' комментариев');
  };

  // Функция нахождения массива комментариев в сгенерированных описаниях, создания на их основе списка комментариев к полноразмерному фото
  const createSocialComments = (idNum, commentsShown) => {
    removeComments();
    let commentNumber = 0;
    const commentsFragment = document.createDocumentFragment();
    const socialComments = descriptionList.find((element) => element.id === Number(idNum)).comments;
    socialComments.forEach(({id, avatar, message, name}) => {
      commentNumber++;
      const commentElement = bigPictureCommentTemplate.cloneNode(true);
      commentElement.dataset.commentId = id;
      commentElement.querySelector('.social__picture').src = avatar;
      commentElement.querySelector('.social__picture').alt = name;
      commentElement.querySelector('.social__text').textContent = message;
      if (commentNumber > (commentsShown + COMMENTS_NEW_UPLOAD)) {
        commentElement.classList.add('hidden');
      }
      commentsFragment.appendChild(commentElement);
    });
    bigPictureCommentsList.appendChild(commentsFragment);
    commentsShown += COMMENTS_NEW_UPLOAD;
    setCommentsCount(Math.min(bigPictureTotalComments, commentsShown));
    toggleCommentsLoader();
  };

  // Функция добавления комментариев
  const getMoreComments = (idNum) => {
    const commentLoaded = parseInt(bigPictureSocialComments.textContent, 10);
    createSocialComments(idNum, commentLoaded);
  };

  // Обработчик нажатия на кнопку добавления комментариев
  const onCommentsLoaderClick = () => getMoreComments(pictureId);

  // Переменная вызова функции скролла
  const getScroll = rememberScroll();

  // Функция закрытия полноразмерного фото
  const closeBigPicture = () => {
    removeComments();
    document.querySelector('body').classList.remove('modal-open');
    bigPictureCommentsLoader.removeEventListener('click', onCommentsLoaderClick);
    bigPicture.classList.add('hidden');
    getScroll();
  };

  // Вызов функции закрытия по нажатию Esc
  const escapeModal = (evt) => onDocumentEscape(evt, closeBigPicture);

  // Функция открытия полноразмерного фото
  const onPictureClick = (evt) => {
    if (evt.target.matches('.picture__img')) {
      targetNode = evt.target;
      bigPicture.dataset.bigPictureId = targetNode.closest('.picture').dataset.thumbnailId;
      bigPictureImg.src = targetNode.src;
      bigPictureCaption.textContent = targetNode.alt;
      bigPictureLikes.textContent = Number(targetNode.closest('.picture').querySelector('.picture__likes').textContent);
      bigPictureTotalComments = targetNode.closest('.picture').querySelector('.picture__comments').textContent;
      pictureId = targetNode.closest('.picture').dataset.thumbnailId;
      createSocialComments(pictureId, 0);
      document.body.classList.add('modal-open');
      getScroll();
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', escapeModal, {once: true});
      bigPictureReset.addEventListener('click', closeBigPicture, {once: true});
      bigPictureCommentsLoader.addEventListener('click', onCommentsLoaderClick);

    }
  };

  // Вызов функции открытия по нажатию на миниатюру
  document.querySelector('.pictures').addEventListener('click', onPictureClick);

};

export { showBigPicture };

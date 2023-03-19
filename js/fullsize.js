import {isEscapeKey, rememberScroll} from './util.js';

const showBigPicture = (descriptionList) => {
  // Элементы полноэкранного изображения, открываемой миниатюры и количества лайков
  const bigPicture = document.querySelector('.big-picture');
  const bigPicturePreview = bigPicture.querySelector('.big-picture__preview');
  const bigPictureImg = bigPicturePreview.querySelector('.big-picture__img')
    .querySelector('img');
  const bigPictureCaption = bigPicturePreview.querySelector('.social__caption');
  const bigPictureLikes = bigPicturePreview.querySelector('.likes-count');
  const bigPictureComments = bigPicturePreview.querySelector('.comments-count');
  const bigPictureReset = bigPicturePreview.querySelector('.big-picture__cancel');
  const bigPictureSocialComments = bigPicturePreview.querySelector('.social__comment-count');
  const bigPictureCommentsLoader = bigPicturePreview.querySelector('.comments-loader');
  const bigPictureCommentTemplate = bigPicturePreview.querySelector('.social__comment');
  const bigPictureCommentsList = bigPicturePreview.querySelector('.social__comments');
  let targetNode;
  let likesCount;

  // Функция нахождения массива комментариев в сгенерированных описаниях, создания на их основе списка комментариев к полноразмерному фото
  const createSocialComments = (idNum) => {
    const commentsFragment = document.createDocumentFragment();
    const socialComments = descriptionList.find((element) => element.id === Number(idNum)).comments;
    socialComments.forEach(({id, avatar, message, name}) => {
      const commentElement = bigPictureCommentTemplate.cloneNode(true);
      commentElement.dataset.commentId = id;
      commentElement.querySelector('.social__picture').src = avatar;
      commentElement.querySelector('.social__picture').alt = name;
      commentElement.querySelector('.social__text').textContent = message;
      commentsFragment.appendChild(commentElement);
    });
    bigPictureCommentsList.appendChild(commentsFragment);
    for (let i = 0; i < bigPictureCommentsList.children.length; i++) {
      const comment = bigPictureCommentsList.children[i];
      if (!comment.hasAttribute('data-comment-id')) {
        bigPictureCommentsList.removeChild(comment);
        i--;
      }
    }
  };

  // Переменная вызова функции скролла
  const getScroll = rememberScroll();

  // Функция добавления/уменьшения лайков при нажатии на соотв. кнопку полноразмерного фото
  const onLikesClick = (evt) => {
    if (evt.target.closest('.likes-count')) {
      if (targetNode.closest('.picture').classList.contains('checked')) {
        likesCount--;
      } else {
        likesCount++;
      }
      bigPictureLikes.textContent = likesCount;
      targetNode.closest('.picture').querySelector('.picture__likes').textContent = likesCount;
      targetNode.closest('.picture').classList.toggle('checked');
    }
  };

  // Функция закрытия полноразмерного фото
  const bigPictureClose = () => {
    for (let i = 0; i < bigPictureCommentsList.children.length; i++) {
      const comment = bigPictureCommentsList.children[i];
      bigPictureCommentsList.removeChild(comment);
      i--;
    }
    bigPicture.classList.add('hidden');
    getScroll();
    document.querySelector('body').classList.remove('modal-open');
    bigPictureLikes.removeEventListener('click', onLikesClick);
    bigPicture.removeEventListener('click', onPreviewOutsideClick);
  };

  // Вызов функции закрытия по клику за пределами полноразмерного фото
  function onPreviewOutsideClick(evt) {
    if (!evt.target.closest('.big-picture__preview')) {
      bigPictureClose();
    }
  }

  // Вызов функции закрытия по нажатию Esc
  const onDocumentEscape = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      bigPictureClose();
    }
  };

  // Функция открытия полноразмерного фото
  const bigPictureOpen = (evt) => {
    if (evt.target.matches('.picture__img')) {
      targetNode = evt.target;
      bigPicture.dataset.bigPictureId = targetNode.closest('.picture').dataset.thumbnailId;
      bigPictureImg.src = targetNode.src;
      bigPictureCaption.textContent = targetNode.alt;
      likesCount = Number(targetNode.closest('.picture').querySelector('.picture__likes').textContent);
      bigPictureLikes.textContent = likesCount;
      bigPictureComments.textContent = targetNode.closest('.picture')
        .querySelector('.picture__comments').textContent;
      createSocialComments(targetNode.closest('.picture').dataset.thumbnailId);
      // скрыты до выполнения второй части задания
      bigPictureSocialComments.classList.add('hidden');
      bigPictureCommentsLoader.classList.add('hidden');
      //
      document.querySelector('body').classList.add('modal-open');
      getScroll();
      document.addEventListener('keydown', onDocumentEscape, {once: true});
      bigPictureReset.addEventListener('click', bigPictureClose, {once: true});
      bigPicture.addEventListener('click', onPreviewOutsideClick);
      bigPictureLikes.addEventListener('click', onLikesClick);
      bigPicture.classList.remove('hidden');
    }
  };

  // Вызов функции открытия по нажатию на миниатюру
  document.querySelector('.pictures').addEventListener('click', bigPictureOpen);

};

export { showBigPicture };

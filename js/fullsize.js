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
  let bigPictureComments;
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
      commentElement.classList.add('hidden');
      commentsFragment.appendChild(commentElement);
    });
    bigPictureCommentsList.appendChild(commentsFragment);
    for (let i = 0; i < bigPictureCommentsList.children.length; i++) {
      const comment = bigPictureCommentsList.children[i];
      if (!comment.hasAttribute('data-comment-id')) {
        bigPictureCommentsList.removeChild(comment);
        i--;
      }
      if (i < COMMENTS_NEW_UPLOAD) {
        comment.classList.remove('hidden');
      }
    }
  };

  // Функция отображения количества комментариев в полноэкранном изображении
  const setCommentsCount = (shown) => {
    bigPictureSocialComments.textContent = '';
    const newSpan = document.createElement('span');
    newSpan.classList.add('comments-count');
    newSpan.textContent = `${bigPictureComments}`;
    bigPictureSocialComments.append(`${shown} из `, newSpan, ' комментариев');
  };

  // Функция добавления комментариев
  const addMoreComments = () => {
    let commentLoaded = 0;
    let commentShown;
    for (let i = COMMENTS_NEW_UPLOAD; i < bigPictureCommentsList.children.length; i++) {
      if (bigPictureCommentsList.children[i].classList.contains('hidden') && commentLoaded < COMMENTS_NEW_UPLOAD) {
        bigPictureCommentsList.children[i].classList.remove('hidden');
        commentLoaded++;
        commentShown = i + 1;
      }
      if (!bigPictureCommentsList.lastElementChild.classList.contains('hidden')) {
        bigPictureCommentsLoader.classList.add('hidden');
      }
      setCommentsCount(commentShown);
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
    document.querySelector('body').classList.remove('modal-open');
    bigPictureLikes.removeEventListener('click', onLikesClick);
    bigPictureCommentsLoader.removeEventListener('click', addMoreComments);
    bigPicture.classList.add('hidden');
    getScroll();
  };

  // Вызов функции закрытия по нажатию Esc
  const escapeModal = (evt) => onDocumentEscape(evt, bigPictureClose);

  // Функция открытия полноразмерного фото
  const onPictureClick = (evt) => {
    if (evt.target.matches('.picture__img')) {
      targetNode = evt.target;
      bigPicture.dataset.bigPictureId = targetNode.closest('.picture').dataset.thumbnailId;
      bigPictureImg.src = targetNode.src;
      bigPictureCaption.textContent = targetNode.alt;
      likesCount = Number(targetNode.closest('.picture').querySelector('.picture__likes').textContent);
      bigPictureLikes.textContent = likesCount;
      bigPictureComments = targetNode.closest('.picture').querySelector('.picture__comments').textContent;
      setCommentsCount(Math.min(bigPictureComments, COMMENTS_NEW_UPLOAD));
      createSocialComments(targetNode.closest('.picture').dataset.thumbnailId);
      if (bigPictureCommentsList.lastElementChild.classList.contains('hidden')) {
        bigPictureCommentsLoader.classList.remove('hidden');
      } else {
        bigPictureCommentsLoader.classList.add('hidden');
      }
      document.body.classList.add('modal-open');
      getScroll();
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', escapeModal, {once: true});
      bigPictureReset.addEventListener('click', bigPictureClose, {once: true});
      bigPictureLikes.addEventListener('click', onLikesClick);
      bigPictureCommentsLoader.addEventListener('click', addMoreComments);

    }
  };

  // Вызов функции открытия по нажатию на миниатюру
  document.querySelector('.pictures').addEventListener('click', onPictureClick);

};

export { showBigPicture };

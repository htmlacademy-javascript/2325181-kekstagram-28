import {rememberScroll, escapeDocument} from './util.js';

const ADD_MORE_COMMENTS_COUNT = 5;

const showBigPicture = (pictureData) => {

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

  const toggleCommentsLoader = () => {
    if (bigPictureCommentsList.lastElementChild.classList.contains('hidden')) {
      bigPictureCommentsLoader.classList.remove('hidden');
    } else {
      bigPictureCommentsLoader.classList.add('hidden');
    }
  };

  const removeComments = () => {
    bigPicturePreview.querySelectorAll('.social__comment').forEach((comment) => comment.remove());
  };

  const setCommentsCount = (shown) => {
    bigPictureSocialComments.textContent = '';
    const newSpan = document.createElement('span');
    newSpan.classList.add('comments-count');
    newSpan.textContent = `${bigPictureTotalComments}`;
    bigPictureSocialComments.append(`${shown} из `, newSpan, ' комментариев');
  };

  const createSocialComments = (pictureId, commentsShown) => {
    removeComments();
    let commentNumber = 0;
    const commentsFragment = document.createDocumentFragment();
    const socialComments = pictureData.find((element) => element.id === Number(pictureId)).comments;
    socialComments.forEach(({id, avatar, message, name}) => {
      commentNumber++;
      const commentElement = bigPictureCommentTemplate.cloneNode(true);
      commentElement.dataset.commentId = id;
      commentElement.querySelector('.social__picture').src = avatar;
      commentElement.querySelector('.social__picture').alt = name;
      commentElement.querySelector('.social__text').textContent = message;
      if (commentNumber > (commentsShown + ADD_MORE_COMMENTS_COUNT)) {
        commentElement.classList.add('hidden');
      }
      commentsFragment.appendChild(commentElement);
    });
    bigPictureCommentsList.appendChild(commentsFragment);
    commentsShown += ADD_MORE_COMMENTS_COUNT;
    setCommentsCount(Math.min(bigPictureTotalComments, commentsShown));
    toggleCommentsLoader();
  };

  const getMoreComments = (pictureId) => {
    const commentLoaded = parseInt(bigPictureSocialComments.textContent, 10);
    createSocialComments(pictureId, commentLoaded);
  };

  const onCommentsLoaderClick = () => getMoreComments(bigPicture.dataset.bigPictureId);

  const getScroll = rememberScroll();

  const closeBigPicture = () => {
    removeComments();
    document.querySelector('body').classList.remove('modal-open');
    bigPictureCommentsLoader.removeEventListener('click', onCommentsLoaderClick);
    bigPicture.classList.add('hidden');
    getScroll();
  };

  const onModalEscape = (evt) => escapeDocument(evt, closeBigPicture);
  const onBigPictureClose = () => closeBigPicture();

  const onPictureClick = (evt) => {
    if (evt.target.matches('.picture__img')) {
      targetNode = evt.target;
      bigPicture.dataset.bigPictureId = targetNode.closest('.picture').dataset.thumbnailId;
      bigPictureImg.src = targetNode.src;
      bigPictureCaption.textContent = targetNode.alt;
      bigPictureLikes.textContent = Number(targetNode.closest('.picture').querySelector('.picture__likes').textContent);
      bigPictureTotalComments = targetNode.closest('.picture').querySelector('.picture__comments').textContent;
      createSocialComments(bigPicture.dataset.bigPictureId, 0);
      document.body.classList.add('modal-open');
      getScroll();
      bigPicture.classList.remove('hidden');
      document.addEventListener('keydown', onModalEscape, {once: true});
      bigPictureReset.addEventListener('click', onBigPictureClose, {once: true});
      bigPictureCommentsLoader.addEventListener('click', onCommentsLoaderClick);

    }
  };

  document.querySelector('.pictures').addEventListener('click', onPictureClick);

};

export { showBigPicture };

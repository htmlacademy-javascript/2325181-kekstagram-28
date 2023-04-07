const isEscapeKey = (evt) => evt.key === 'Escape';

const onDocumentEscape = (evt, closingFunction) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closingFunction();
  }
};

const rememberScroll = () => {
  let currentScroll = 0;
  return () => {
    if (window.scrollY || currentScroll) {
      if (currentScroll === 0) {
        currentScroll = window.scrollY;
      } else {
        window.scroll(0, currentScroll);
        currentScroll = 0;
      }
    }
  };
};

const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const getRandomPosition = () => Math.random() - 0.5;

const isImage = (image) => {
  const IMAGE_EXTENTIONS = ['jpg', 'jpeg', 'png'];
  const imageName = image.name.toLowerCase();
  return IMAGE_EXTENTIONS.some((extension) => imageName.endsWith(extension));
};

export { isEscapeKey, rememberScroll, onDocumentEscape, debounce, getRandomPosition, isImage };

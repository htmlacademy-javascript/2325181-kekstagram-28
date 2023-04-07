import {getDataErrorMessageParameters} from './upload-form.js';
import {getData} from './api.js';
import {renderPictures} from './render.js';
import {showBigPicture} from './fullsize.js';
import {activateImageFilter} from './filter.js';
import {debounce} from './util.js';

getData()
  .then((data) => {
    renderPictures(data);
    const debouncedRenderPictures = debounce(renderPictures);
    activateImageFilter(data, debouncedRenderPictures);
    showBigPicture(data);
  })
  .catch(() => {
    getDataErrorMessageParameters();
  });

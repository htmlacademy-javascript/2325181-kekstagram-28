import {getDataErrorMessageParameters} from './upload-form.js';
import {getData} from './api.js';
import {renderPictures} from './render.js';
import {showBigPicture} from './fullsize.js';

getData()
  .then((data) => {
    renderPictures(data);
    showBigPicture(data);
  })
  .catch(() => {
    getDataErrorMessageParameters();
  });

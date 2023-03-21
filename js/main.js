import {getDescriptionList} from './data.js';
import {renderPictures} from './render.js';
import {showBigPicture} from './fullsize.js';

const descriptionList = getDescriptionList();

renderPictures(descriptionList);

showBigPicture(descriptionList);

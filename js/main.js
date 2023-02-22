const DESCRIPTIONS_QUANTITY = 25;
const PHOTOS_QUANTITY = 25;
const COMMENTS_QUANTITY = 8;


//Сообщения в комменатриях
const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

//Сообщения в комменатриях
const NAMES = [
  'Валерия',
  'Иван',
  'Артём',
  'Дарья',
  'Максим',
  'Александр',
  'Марк',
  'Вадим',
  'Сабина',
  'Антон',
  'Лев',
  'Эмиль',
  'Елизавета',
  'Ксения',
  'Александра'
];

//Описания фотографий
const PHOTO_DESCRIPTIONS = [
  'красивое фото, но не для сна.',
  'а это мы с мужем в день нашей свадьбы. Он стоит в свадебном костюме, а я в черном платье.',
  'а это мы гуляли по парку и я сказал, что мне надоело, а она ответила: "Ладно, пошли домой"',
  'красивое фото на стене, на котором я вижу свое отражение.',
  'красивое фото на стене не может быть настоящим.',
  'а это мы с женой на выходных. Она пошла в душ, а я остался дома с ребенком.',
  'а это мы с ним во всю ночь играли в игру "найди отличия"'
];

// Генератор случайных чисел
const getRandomNumber = (min, max) => {
  const from = Math.ceil(Math.min(min, max));
  const till = Math.floor(Math.max(min, max));
  const result = Math.random() * (till - from + 1) + from;
  return Math.floor(result);
};

// Генератор случайных неповторяющихся чисел
const getRandomId = (min, max) => {
  const idList = [];
  return function () {
    let currentValue = getRandomNumber(min, max);
    while (idList.includes(currentValue)) {
      currentValue = getRandomNumber(min, max);
    }
    idList.push(currentValue);
    return currentValue;
  };
};

// Генераторы уникальных номеров для комментариев, описаний и фото
const getCommentId = getRandomId(1, COMMENTS_QUANTITY);
const getDescriptionId = getRandomId(1, DESCRIPTIONS_QUANTITY);
const getPhotoId = getRandomId(1, PHOTOS_QUANTITY);


// Генератор случайного индекса массива
const getRandomArrayElement = (arrayInput) => arrayInput[getRandomNumber(0, arrayInput.length - 1)];

// Создание нового комменатрия
const getNewComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
  message: getRandomArrayElement (MESSAGES),
  name: getRandomArrayElement(NAMES)
});


// Генерация списка комментариев
const commentList = Array.from({length: COMMENTS_QUANTITY}, getNewComment);

// Создание нового описания фотографии
const getNewDescription = () => ({
  id: getDescriptionId(),
  url: `photos/${getPhotoId()}.jpg`,
  description: getRandomArrayElement(PHOTO_DESCRIPTIONS),
  likes: getRandomNumber(15, 200),
  comments: commentList
});


// Генерация списка описаний
const descriptionList = Array.from({length: DESCRIPTIONS_QUANTITY}, getNewDescription);

console.log(descriptionList);

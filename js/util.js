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

// Генератор случайного индекса массива
const getRandomArrayElement = (arrayInput) => arrayInput[getRandomNumber(0, arrayInput.length - 1)];

export { getRandomNumber, getRandomId, getRandomArrayElement };

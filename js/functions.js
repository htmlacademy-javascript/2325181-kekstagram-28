// Функция для проверки длины строки.

function isStringLength(string, length) {
  return string.length <= length;
}

// Вызовы функции isStringLength с аргументами, указанными в задании.
// Cтрока короче 20 символов
isStringLength('проверяемая строка', 20); // true
// Длина строки ровно 18 символов
isStringLength('проверяемая строка', 18); // true
// Строка длиннее 10 символов
isStringLength('проверяемая строка', 10); // false

// Функция для проверки, является ли строка палиндромом. Пробелы при проверке не учитываются.

function isPalindrom(string) {
  return (string.replaceAll(' ','').toLowerCase() === string.replaceAll(' ','').split('').reverse().join('').toLowerCase());
}


// Вызовы функции isPalindrom с аргументами, указанными в задании.
// Строка является палиндромом
isPalindrom('топот'); // true
// Несмотря на разный регистр, тоже палиндром
isPalindrom('ДовОд'); // true
// Это не палиндром
isPalindrom('Кекс'); // false
// Это палиндром
isPalindrom('Лёша на полке клопа нашёл '); // true

// Функция, которая принимает строку, извлекает содержащиеся в ней цифры от 0 до 9 и возвращает их в виде целого положительного числа. Если в строке нет ни одной цифры, функция должна вернуть NaN.

function extractNumbers(input) {
  return parseInt(String(input).replace(/[^0-9]/g, ''), 10);
}

// Вызовы функции extractNumbers с аргументами, указанными в задании.
extractNumbers('2023 год'); // 2023
extractNumbers('ECMAScript 2022'); // 2022
extractNumbers('1 кефир, 0.5 батона'); // 105
extractNumbers('агент 007'); // 7
extractNumbers('а я томат'); // NaN
extractNumbers(2023); // 2023
extractNumbers(-1); // 1
extractNumbers(1.5); // 15

/* Функция, которая принимает три параметра: исходную строку, минимальную длину и строку с добавочными символами — и возвращает исходную строку, дополненную указанными символами до заданной длины. Символы добавляются в начало строки. Если исходная строка превышает заданную длину, она не должна обрезаться. Если «добивка» слишком длинная, она обрезается с конца. */

function concatString(initialString, minimalLength, addSymbols) {
  if (minimalLength > initialString.length) {
    const timesAddSymbols = addSymbols.repeat((minimalLength - initialString.length) / addSymbols.length);
    const shortAddSymbols = addSymbols.substr(0, (minimalLength - initialString.length) % addSymbols.length);
    return shortAddSymbols.concat(timesAddSymbols, initialString);
  } return initialString;
}

// Вызовы функции extractNumbers с аргументами, указанными в задании.
// Добавочный символ использован один раз
concatString('1', 2, '0'); // '01'
// Добавочный символ использован три раза
concatString('1', 4, '0'); // '0001'
// Добавочные символы обрезаны с конца
concatString('q', 4, 'werty'); // 'werq'
// Добавочные символы использованы полтора раза
concatString('q', 4, 'we'); // 'wweq'
// Добавочные символы не использованы, исходная строка не изменена
concatString('qwerty', 4, '0'); // 'qwerty'

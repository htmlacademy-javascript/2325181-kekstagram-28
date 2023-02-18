// Функция для проверки длины строки.

function isStringLength(string, length) {
  return string.length <= length;
}

// Функция для проверки, является ли строка палиндромом. Пробелы при проверке не учитываются.

function isPalindrom(string) {
  return (string.replaceAll(' ','').toLowerCase() === string.replaceAll(' ','').split('').reverse().join('').toLowerCase());
}

// Функция, которая принимает строку, извлекает содержащиеся в ней цифры от 0 до 9 и возвращает их в виде целого положительного числа. Если в строке нет ни одной цифры, функция должна вернуть NaN.

function extractNumbers(input) {
  return parseInt(String(input).replace(/[^0-9]/g, ''), 10);
}

/* Функция, которая принимает три параметра: исходную строку, минимальную длину и строку с добавочными символами — и возвращает исходную строку, дополненную указанными символами до заданной длины. Символы добавляются в начало строки. Если исходная строка превышает заданную длину, она не должна обрезаться. Если «добивка» слишком длинная, она обрезается с конца. */

function concatString(initialString, minimalLength, addSymbols) {
  if (minimalLength > initialString.length) {
    const timesAddSymbols = addSymbols.repeat((minimalLength - initialString.length) / addSymbols.length);
    const shortAddSymbols = addSymbols.substr(0, (minimalLength - initialString.length) % addSymbols.length);
    return timesAddSymbols.concat(shortAddSymbols, initialString);
  } return initialString;
}

import dayjs from 'dayjs';

// Получение рандомного элемента из массива

export function getRandomItem(arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
}

// Создание массива с рандомным количеством элементов

export function getRandomArray(array) {
  const arrayNew = new Array(getRandomNumber(1, array.length)).fill(' ');

  arrayNew.forEach((element, index) => {
    const ranItem = getRandomItem(array);

    arrayNew[index] = ranItem;
  });

  return [...new Set(arrayNew)];
}

// Получение рандомного числа

export function getRandomNumber (minValue, maxValue) {
  if (minValue < 0) {
    throw new Error('Укажите минимальное значение больше 0');
  }
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}

// Получение рандомного числа с плавающей точкой

export function getRandomValue (minValue, maxValue, range) {
  if (minValue <= 0) {
    throw new Error('Укажите минимальное значение больше 0');
  }

  const rundomNumber = Math.random() * (maxValue - minValue + 1) + minValue;
  return Number(rundomNumber.toFixed(range));
}

// Конвертирует минуты в часы

export function getTimeFromMins(mins) {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;

  if(hours) {
    return `${hours}h ${minutes}m`;
  }
  return `${mins}m`;
}

// Переведет дату в нужный вид

export const humanizeFilmDueDate = (dueDate) => dayjs(dueDate).format('D MMMM YYYY');

export const humanizeCommentDueDate = (dueDate) => dayjs(dueDate).format('YYYY/M/D h:mm');

export const randomBoolean = () => Math.random() >= 0.5;

export const sortFilmsByDateDown = (filmA, filmB) => filmB.filmInfo.release.date - filmA.filmInfo.release.date;

export const convertStringToCamelCase = (str) => str
  .replace(
    /([-_][a-z])/ig, ($1) => $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', '')
  );

export const checkIfIsObject = (obj) => obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';

export const convertSnakeCaseKeysToCamelCase = (obj) => {
  if (checkIfIsObject(obj)) {
    const n = {};

    Object.keys(obj)
      .forEach((k) => {
        n[convertStringToCamelCase(k)] = convertSnakeCaseKeysToCamelCase(obj[k]);
      });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => convertSnakeCaseKeysToCamelCase(i));
  }

  return obj;
};

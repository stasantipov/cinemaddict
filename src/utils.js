import dayjs from 'dayjs';

export function getTimeFromMins(mins) {
  const hours = Math.trunc(mins/60);
  const minutes = mins % 60;

  if(hours) {
    return `${hours}h ${minutes}m`;
  }
  return `${mins}m`;
}

export const humanizeFilmDueDate = (date) => dayjs(date).format('D MMMM YYYY');

export const humanizeCommentDueDate = (dueDate) => dayjs(dueDate).format('YYYY/M/D h:mm');

export const sortFilmsByDateDown = (filmA, filmB) => new Date (filmB.filmInfo.release.date) - new Date (filmA.filmInfo.release.date);

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

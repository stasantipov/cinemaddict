import {EMOTIONS, dateComment} from './data.js';
import {getRandomItem, humanizeFilmDueDate} from '../util.js';
import {nanoid} from 'nanoid';

// Создание объекта с комментарием

export const createMockComment = () => ({
  id: nanoid(),
  commenter: 'Ilya OReilly',
  comment: 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
  dateComment: humanizeFilmDueDate(dateComment),
  emotion: getRandomItem(EMOTIONS)
});

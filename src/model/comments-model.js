import Observable from '../framework/observable.js';

import {createMockComment} from '../mock/create-mock-comment.js';
const MAX_COMMENTS_TOTAL = 100;

const ALL_COMMENTS = Array.from({length: MAX_COMMENTS_TOTAL}, createMockComment);

export default class CommentsModel extends Observable {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  get comments() {
    return this.#film.comments.map((id) => ALL_COMMENTS.find((element) => element.id === id));
  }

  addComment = (event, payload) => {
    this.#film.comments = [
      ...this.#film.comments,
      payload
    ];

    ALL_COMMENTS.push(payload);

    this._notify(event, this.#film);
  };

  deleteComment = (updateType, commentID) => {
    this.#film.comments = this.#film.comments.filter(( _ , index) => index !== commentID);

    this._notify(updateType, this.#film);
  };
}

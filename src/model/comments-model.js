import Observable from '../framework/observable.js';
import {createMockComment} from '../mock/create-mock-comment.js';
import { UpdateType } from '../const.js';

const MAX_COMMENTS_TOTAL = 100;
const ALL_COMMENTS = Array.from({length: MAX_COMMENTS_TOTAL}, createMockComment);

export default class CommentsModel extends Observable {
  #film = null;
  #moviesApiService= null;
  #comments = [];

  constructor(film, moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get comments() {
    return this.#comments;

  }

  init = async (film) => {
    this.#film = film;
    try {
      this.#comments = await this.#moviesApiService.getComments(film);
    } catch (err) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT_COMMENTS, this.#film);
  };

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

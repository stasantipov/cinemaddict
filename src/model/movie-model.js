import {createMockArray} from '../mock/create-mock-object.js';
import Observable from '../framework/observable.js';


export default class MovieModel extends Observable {
  #movies = [];

  constructor() {
    super();
    this.#movies = createMockArray(22);
  }

  get movies () {
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }

  updateFilm = (updateType, update) => {
    const index = this.#movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#movies = [
      ...this.#movies.slice(0, index),
      update,
      ...this.#movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  };
}

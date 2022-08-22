import Observable from '../framework/observable.js';
import {convertSnakeCaseKeysToCamelCase} from '../utils.js';
import {UpdateType} from '../const.js';


export default class MovieModel extends Observable {
  #movies = [];
  #moviesApiService = null;

  constructor(moviesApiService) {
    super();
    this.#moviesApiService = moviesApiService;
  }

  get movies () {
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesApiService.movies;
      this.#movies = movies.map(this.#adaptToClient);
    } catch(err) {
      this.#movies = [];
    }

    this._notify(UpdateType.INIT);
  };

  updateFilm = async (updateType, update) => {
    const index = this.#movies.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#moviesApiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#movies = [
        ...this.#movies.slice(0, index),
        update,
        ...this.#movies.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch(err) {
      throw new Error(err);
    }
  };

  #adaptToClient = (film) => {
    const {id, filmInfo, userDetails, comments} = convertSnakeCaseKeysToCamelCase(film);
    filmInfo.userDetails = userDetails;
    return {id, filmInfo, comments};
  };
}

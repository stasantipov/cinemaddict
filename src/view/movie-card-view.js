import AbstractView from '../framework/view/abstract-view.js';
import {getTimeFromMins} from '../utils.js';

const FILM_CARD = {
  filmInfo: {
    title: '',
    totalRating: 0,
    poster: '',
    ageRating: 1888,
    age: 0,
    runtime: 0,
    genre: '',
    description: ''
  }
};

const showDescription = (description) => description.length > 139 ? `${description.slice(0, 139)}…` : description;

const createFilmCard = (movie) => {
  const {title, genre, description, release, totalRating, poster, runtime} = movie.filmInfo;
  const {watchlist, alreadyWatched, favorite} = movie.filmInfo.userDetails;

  const watchlistClassName = watchlist
    ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active'
    : 'film-card__controls-item--add-to-watchlist';

  const watchedClassName = alreadyWatched
    ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active'
    : 'film-card__controls-item--mark-as-watched';

  const favoriteClassName = favorite
    ? 'film-card__controls-item--favorite film-card__controls-item--active'
    : 'film-card__controls-item--favorite';

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${new Date(release.date).getFullYear()}</span>
          <span class="film-card__duration">${getTimeFromMins(runtime)}</span>
          <span class="film-card__genre">${genre.join(', ')}</span>
        </p>
        <img src="./${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${showDescription(description)}</p>
        <span class="film-card__comments">${movie.comments.length} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`
  );
};

export default class MovieCardView extends AbstractView {
  #movie = null;

  constructor(movie = FILM_CARD) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createFilmCard(this.#movie);
  }

  setFilmClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('.film-card__link').addEventListener('click', this.#clickHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}

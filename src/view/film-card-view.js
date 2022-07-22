import AbstractView from '../framework/view/abstract-view.js';

// Создание одной карточки фильма

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

const createFilmCard = (movie) => {
  const {title, genre, description, ageRating, totalRating, poster, runtime} = movie.filmInfo;

  return (
    `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${totalRating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${ageRating}</span>
          <span class="film-card__duration">${runtime}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <span class="film-card__comments">5 comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist film-card__controls-item--active" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched film-card__controls-item--active" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
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
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };
}

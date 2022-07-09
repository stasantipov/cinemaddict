import {createElement} from '../render.js';

// Добавление фильма в список

const createNewMovieListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">

      </div>
    </section>
  </section>`
);

export default class MovieListView {
  #element = null;
  #movie = [];

  constructor(movie) {
    this.#movie = movie;
  }

  get template() {
    return createNewMovieListTemplate(this.#movie);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

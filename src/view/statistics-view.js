import AbstractView from '../framework/view/abstract-view.js';

const createNewStatisticsTemplate = (movies) => `<p>${movies.length} movies inside</p>`;

export default class StatisticsView extends AbstractView {
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createNewStatisticsTemplate(this.#movies);
  }
}

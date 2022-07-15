import AbstractView from '../framework/view/abstract-view.js';

const createNoFilmTemplate = (text = 'There are no movies in our database') => `<h2 class="films-list__title">${text}</h2>`;

export default class NoFilmView extends AbstractView {
  get template() {
    return createNoFilmTemplate();
  }
}

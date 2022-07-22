import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (filters) => (
  `<nav class="main-navigation">
    <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
    <a href="#watchlist" class="main-navigation__item">${filters[0].name} <span class="main-navigation__item-count">${filters[0].count}</span></a>
    <a href="#history" class="main-navigation__item">${filters[1].name} <span class="main-navigation__item-count">${filters[1].count}</span></a>
    <a href="#favorites" class="main-navigation__item">${filters[2].name} <span class="main-navigation__item-count">${filters[2].count}</span></a>
  </nav>`
);

export default class NavigationView extends AbstractView {
  #movie = null;

  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createNavigationTemplate(this.#movie);
  }
}

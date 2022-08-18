import AbstractView from '../framework/view/abstract-view.js';

const createNavigationTemplate = (filters, currentFilter) => {
  const activeClass = 'main-navigation__item--active';

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${currentFilter === filters[0].type ? activeClass : ''}" data-type="${filters[0].type}">${filters[0].name} movies</a>
      <a href="#watchlist" class="main-navigation__item ${currentFilter === filters[1].type ? activeClass : ''}" data-type="${filters[1].type}">${filters[1].name} <span class="main-navigation__item-count">${filters[1].count}</span></a>
      <a href="#history" class="main-navigation__item ${currentFilter === filters[2].type ? activeClass : ''}" data-type="${filters[2].type}">${filters[2].name} <span class="main-navigation__item-count">${filters[2].count}</span></a>
      <a href="#favorites" class="main-navigation__item ${currentFilter === filters[3].type ? activeClass : ''}" data-type="${filters[3].type}">${filters[3].name} <span class="main-navigation__item-count">${filters[3].count}</span></a>
    </nav>`
  );
};

export default class NavigationView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  constructor({filters, filter}) {
    super();
    this.#filters = filters;
    this.#currentFilter = filter;
  }

  get template() {
    return createNavigationTemplate(this.#filters, this.#currentFilter);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('click', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.type);
  };
}

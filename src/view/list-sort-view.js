import AbstractView from '../framework/view/abstract-view.js';

export const SortType = {
  DEFAULT: 'default',
  SORT_BY_DATE: 'date-down',
  SORT_BY_RATING: 'rating',
};

const createNewFilterTemplate = (currentSortType) => {
  const activeClass = 'sort__button--active';

  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button ${currentSortType === SortType.DEFAULT ? activeClass : ''}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.SORT_BY_DATE ? activeClass : ''}" data-sort-type="${SortType.SORT_BY_DATE}">Sort by date</a></li>
      <li><a href="#" class="sort__button ${currentSortType === SortType.SORT_BY_RATING ? activeClass : ''}" data-sort-type="${SortType.SORT_BY_RATING}">Sort by rating</a></li>
    </ul>`
  );
};

export default class SortView extends AbstractView {
  #currentSortType = null;

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createNewFilterTemplate(this.#currentSortType);
  }

  setSortTypeChangeHandler = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  };


  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  };
}

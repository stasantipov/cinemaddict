import {createElement} from '../render.js';

const createNewTopCommentedFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container films-list__container--most-commented">
    </div>
  </section>`
);

export default class MostCommentedFilmsView {
  #element = null;

  get template() {
    return createNewTopCommentedFilmsTemplate();
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

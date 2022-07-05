import {createElement} from '../render.js';

const createNewTopFilmListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container films-list__container--top-films">

    </div>
  </section>`
);

export default class TopFilmsView {
  getTemplate() {
    return createNewTopFilmListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

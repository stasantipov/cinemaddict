import {createElement} from '../render.js';

const createNewButtonShowMoreTemplate = () => '<button class="films-list__show-more">Show more</button>';

export default class ButtonShowMoreView {
  getTemplate() {
    return createNewButtonShowMoreTemplate();
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

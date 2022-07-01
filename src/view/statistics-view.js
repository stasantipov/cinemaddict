import {createElement} from '../render.js';

const createNewStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class StatisticsView {
  getTemplate() {
    return createNewStatisticsTemplate();
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

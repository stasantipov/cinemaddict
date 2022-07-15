import AbstractView from '../framework/view/abstract-view.js';

const createNewStatisticsTemplate = () => '<p>130 291 movies inside</p>';

export default class NoTaskView extends AbstractView {
  get template() {
    return createNewStatisticsTemplate();
  }
}

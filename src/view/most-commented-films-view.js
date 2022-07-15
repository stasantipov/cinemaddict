import AbstractView from '../framework/view/abstract-view.js';

const createNewTopCommentedFilmsTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container films-list__container--most-commented">
    </div>
  </section>`
);

export default class MostCommentedFilmsView extends AbstractView {
  get template() {
    return createNewTopCommentedFilmsTemplate();
  }
}

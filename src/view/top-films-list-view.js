import AbstractView from '../framework/view/abstract-view.js';

const createNewTopFilmListTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container films-list__container--top-films">

    </div>
  </section>`
);

export default class TopFilmsView extends AbstractView {
  get template() {
    return createNewTopFilmListTemplate();
  }
}

import AbstractView from '../framework/view/abstract-view.js';
import {UserTitle} from '../const.js';

const createNewUserNameTemplate = (watchedMovieCount) => {
  let userTitle = UserTitle.NOVICE;

  if (watchedMovieCount > 10) {
    userTitle = UserTitle.FAN;
    if (watchedMovieCount > 20) {
      userTitle = UserTitle.BUFF;
    }
  }

  return  watchedMovieCount
    ? `<section class="header__profile profile">
        <p class="profile__rating">${userTitle}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      </section>`
    : '';
};


export default class UserNameView extends AbstractView {
  #watchedMoviesCount = null;

  constructor(watchedMoviesCount) {
    super();
    this.#watchedMoviesCount = watchedMoviesCount;
  }

  get template() {
    return createNewUserNameTemplate(this.#watchedMoviesCount);
  }
}

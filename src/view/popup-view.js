import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humanizeFilmDueDate, getTimeFromMins, humanizeCommentDueDate } from '../utils.js';
import { KeyCode } from '../const.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

const FILM_CARD = {
  filmInfo: {
    title: '',
    alternativeTitle: '',
    totalRating: 0,
    poster: '',
    ageRating: 0,
    director: '',
    writers: '',
    actors: '',
    age: 0,

    release: {
      date: '',
      releaseCountry: ''
    },
    runtime: 0,
    genre: '',
    description: '',

    commenter: null,
    comment: '',
    dateComment: '',
    emotion: ''
  }
};

const getCheckedAttribute = (chooseEmotion, checkedEmotion) => chooseEmotion === checkedEmotion ? 'checked' : '';

const showNewCommentEmoji = (newCommentEmoji) => newCommentEmoji ? `<img src="images/emoji/${newCommentEmoji}.png" width="70" height="70" alt="emoji-${newCommentEmoji}"></img>` : '';

const createNewCommentTemplate = ({ author, comment, date, emotion, id }) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-smile">
    </span>
    <div>
      <p class="film-details__comment-text">${comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${humanizeCommentDueDate(date)}</span>
        <button class="film-details__comment-delete" data-id="${id}">Delete</button>
      </p>
    </div>
  </li>`
);

const renderComments = (list) => {
  let commentTepmlate = '';
  for (const comment of list) {
    commentTepmlate = commentTepmlate + createNewCommentTemplate(comment);
  }
  return commentTepmlate;
};

const createNewFilmDetailsTemplate = (movie, isDisabled) => {
  const { title, alternativeTitle, genre, director, description, totalRating, poster, runtime, ageRating, writers, actors } = movie.filmInfo;
  const { releaseCountry, date } = movie.filmInfo.release;
  const { watchlist, alreadyWatched, favorite } = movie.filmInfo.userDetails;

  const watchlistClassName = watchlist
    ? 'film-details__control-button--watchlist film-details__control-button--active'
    : 'film-details__control-button--watchlist';

  const watchedClassName = alreadyWatched
    ? 'film-details__control-button--watched film-details__control-button--active'
    : 'film-details__control-button--watched';

  const favoriteClassName = favorite
    ? 'film-details__control-button--favorite film-details__control-button--active'
    : 'film-details__control-button--favorite';

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get" name="commentForm" onsubmit="return false;">
        <div class="film-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeFilmDueDate(date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${getTimeFromMins(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genre.length > 1 ? 'Genres' : 'Genre'}</td>
                  <td class="film-details__cell">
                    <span class="film-details__genre">${genre.join(', ')}</span></td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <button type="button" class="film-details__control-button ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
            <button type="button" class="film-details__control-button ${watchedClassName}" id="watched" name="watched">Already watched</button>
            <button type="button" class="film-details__control-button ${favoriteClassName}" name="favorite">Add to favorites</button>
          </section>
        </div>

        <div class="film-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${movie.comments.length}</span></h3>

            <ul class="film-details__comments-list">
            ${renderComments(movie.comments)}
            </ul>

            <div class="film-details__new-comment">
              <div class="film-details__add-emoji-label">${showNewCommentEmoji(movie.chooseEmotion)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? 'disabled' : ''}>${movie.typedComment}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${getCheckedAttribute(movie.chooseEmotion, 'smile')}>
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${getCheckedAttribute(movie.chooseEmotion, 'sleeping')}>
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${getCheckedAttribute(movie.chooseEmotion, 'puke')}>
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${getCheckedAttribute(movie.chooseEmotion, 'angry')}>
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
      </section>`
  );
};

export default class PopupView extends AbstractStatefulView {
  constructor({ movie = FILM_CARD, handleModelEvent, commentsModel }) {
    super();
    this._state = PopupView.convertDataToState(movie, handleModelEvent);
    commentsModel.addObserver(handleModelEvent);
    this.#setInnerHandlers();
  }

  get template() {
    return createNewFilmDetailsTemplate(this._state);
  }

  get scrollOffset() { return this.element.scrollTop; }
  set scrollOffset(value) { this.element.scrollTop = value; }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseButtonClickHandler(this._callback.closeClick);
    this.setAddCommentKeyDownHandler(this._callback.addKeydown);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
  };

  reset = (movie) => {
    this.updateElement(PopupView.convertDataToState(movie));
  };

  shake() {
    this.element.querySelector('.film-details__comment-input').classList.add('shake');
    setTimeout(() => {
      this.element.querySelector('.film-details__comment-input').classList.remove('shake');
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    const elements = this.element.querySelectorAll('.film-details__comment-delete');
    elements.forEach((elem) => {
      elem.addEventListener('click', () => {
        const { id } = elem.dataset;
        this._callback.deleteClick(id);
        elem.textContent = 'Deleting...';
        elem.disabled = true;
      });
    });
  };

  setCloseButtonClickHandler = (callback) => {
    this._callback.closeClick = callback;
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#closePopupClickHandler);
  };

  setAddCommentKeyDownHandler = (callback) => {
    this._callback.addKeydown = callback;
    this.element.addEventListener('keydown', this.#addCommentKeyDownHandler);
  };

  setWatchlistClickHandler = (callback) => {
    this._callback.watchlistClick = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchlistClickHandler);
  };

  setWatchedClickHandler = (callback) => {
    this._callback.watchedClick = callback;
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedClickHandler);
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteClickHandler);
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.film-details__emoji-list').addEventListener('click', this.#emotionClickHandler);
    this.element.querySelector('textarea.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  #getElementUpdated = (update) => {
    const scrollOffset = this.scrollOffset;
    this.updateElement(update);
    this.scrollOffset = scrollOffset;
  };

  #commentInputHandler = (evt) => {
    const typedComment = evt.target.value;
    this._setState({ ...this._state, typedComment });
  };

  #emotionClickHandler = (evt) => {
    if (evt.target.matches('input[type=radio]')) {
      const chooseEmotion = evt.target.value;
      this.#getElementUpdated({ ...this._state, chooseEmotion });
      evt.stopPropagation();
    }
  };

  #closePopupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.closeClick();
  };

  #addCommentKeyDownHandler = (evt) => {
    if (evt.ctrlKey && evt.keyCode === KeyCode.ENTER) {
      const { value } = evt.target;
      if (value !== '') {
        this._callback.addKeydown({
          comment: value,
          emotion: this._state.chooseEmotion
        });
      }
    }
  };

  #watchlistClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchlistClick();
  };

  #watchedClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };

  static convertDataToState = (movie, handleModelEvent) => ({
    ...movie,
    handleModelEvent,
    chooseEmotion: '',
    typedComment: '',
    isDisabled: false
  });
}

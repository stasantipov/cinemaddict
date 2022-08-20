import {render, replace} from '../framework/render';
import PopupView from '../view/popup-view';
import {humanizeFilmDueDate} from '../utils.js';
import {nanoid} from 'nanoid';
import { UpdateType, UserAction } from '../const.js';

export default class ModalPresenter {
  #movie = null;
  #root = null;
  #popupComponent = null;
  #changeData = () => null;
  #closeModal = () => null;
  #commentsModel = null;
  #handleModelEvent = null;

  constructor({rootNode = document.body, closeModal, onChange, commentsModel, handleModelEvent} = {}) {
    this.#root = rootNode;
    this.#closeModal = closeModal;
    this.#changeData = onChange;
    this.#commentsModel = commentsModel;
    this.#handleModelEvent = handleModelEvent;

    this.#commentsModel.addObserver(this.#handleModelEvent);
  }

  init = ({movie, comments}) => {
    if(!(typeof movie === 'object' && movie !== null && Array.isArray(comments))) {
      throw new Error('');
    }
    this.#movie = {
      ...movie,
      comments: comments
    };

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView({
      commentsModel: this.#commentsModel,
      handleModelEvent: this.#handleModelEvent,
      movie: this.#movie,
      onSubmit: ({chooseEmotion, typedComment}) => {
        if(typeof chooseEmotion === 'string' && chooseEmotion !== '' && typeof typedComment === 'string' && typedComment !== '') {
          this.#changeData(
            UserAction.ADD_COMMENT,
            UpdateType.MINOR,
            {
              id: nanoid(),
              commenter: 'Ilya OReilly',
              comment: typedComment,
              dateComment: humanizeFilmDueDate(new Date ().toISOString()),
              emotion: chooseEmotion
            }
          );
        }
      }});

    this.#popupComponent.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#popupComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#popupComponent.setFavoriteClickHandler(this.#handleFavoriteClick);
    this.#popupComponent.setDeleteClickHandler(this.#handleDeleteClick);

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#root);
    } else {
      replace(this.#popupComponent, prevPopupComponent);
    }
    this.#popupComponent.addEvents(this.#closeModal);
  };

  #handleDeleteClick = (comment) => {
    this.#changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.MINOR,
      comment,
    );
  };

  #handleWatchListClick = () => {
    this.#movie.filmInfo.userDetails.watchlist = !this.#movie.filmInfo.userDetails.watchlist;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: this.#movie
    });
  };

  #handleWatchedClick = () => {
    this.#movie.filmInfo.userDetails.alreadyWatched = !this.#movie.filmInfo.userDetails.alreadyWatched;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: this.#movie
    });
  };

  #handleFavoriteClick = () => {
    this.#movie.filmInfo.userDetails.favorite = !this.#movie.filmInfo.userDetails.favorite;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: this.#movie
    });
  };
}

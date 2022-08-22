import {render, replace} from '../framework/render';
import PopupView from '../view/popup-view';
import {humanizeFilmDueDate} from '../utils.js';
import { UpdateType, UserAction } from '../const.js';

export default class ModalPresenter {
  #movie = null;
  #root = null;
  #popupComponent = null;
  #changeData = () => null;
  #closeModal = () => null;
  #commentsModel = null;
  #handleModelEvent = null;
  #comments = null;

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
      throw new Error('Нет необходимого параметра');
    }

    this.#movie = {
      ...movie,
      comments: comments
    };

    this.#comments = comments.map((element) => element.id);

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView({
      commentsModel: this.#commentsModel,
      handleModelEvent: this.#handleModelEvent,
      movie: this.#movie,
      onSubmit: ({chooseEmotion, typedComment}) => {
        if(typeof chooseEmotion === 'string' && chooseEmotion !== '' && typeof typedComment === 'string' && typedComment !== '') {
          this.#changeData( {
            actionType: UserAction.ADD_COMMENT,
            event: UpdateType.MINOR,
            payload: {
              id: '',
              author: 'Ilya OReilly',
              comment: typedComment,
              date: humanizeFilmDueDate(new Date ().toISOString()),
              emotion: chooseEmotion
            }
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
    this.#changeData({
      actionType: UserAction.DELETE_COMMENT,
      event: UpdateType.MINOR,
      payload: comment
    }
    );
  };

  #handleWatchListClick = () => {
    this.#movie.filmInfo.userDetails.watchlist = !this.#movie.filmInfo.userDetails.watchlist;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        comments: this.#comments
      }
    });
  };

  #handleWatchedClick = () => {
    this.#movie.filmInfo.userDetails.alreadyWatched = !this.#movie.filmInfo.userDetails.alreadyWatched;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        comments: this.#comments
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#movie.filmInfo.userDetails.favorite = !this.#movie.filmInfo.userDetails.favorite;
    this.#changeData({
      actionType: UserAction.UPDATE_MODAL,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        comments: this.#comments
      }
    });
  };
}

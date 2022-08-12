import {render, replace} from '../framework/render';
import PopupView from '../view/popup-view';
import {humanizeFilmDueDate} from '../util.js';
import {nanoid} from 'nanoid';

export default class ModalPresenter {
  #movie = null;
  #root = null;
  #popupComponent = null;
  #changeData = () => null;
  #closeModal = () => null;

  constructor({rootNode = document.body, closeModal, onChange} = {}) {
    this.#root = rootNode;
    this.#closeModal = closeModal;
    this.#changeData = onChange;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevPopupComponent = this.#popupComponent;

    this.#popupComponent = new PopupView({
      movie,
      onSubmit: ({chooseEmotion, typedComment}) => {
        if(typeof chooseEmotion === 'string' && chooseEmotion !== '' && typeof typedComment === 'string' && typedComment !== '') {
          this.#movie.comments = [...this.#movie.comments,
            {
              id: nanoid(),
              commenter: 'Ilya OReilly',
              comment: typedComment,
              dateComment: humanizeFilmDueDate(new Date ().toISOString()),
              emotion: chooseEmotion
            }];
          this.#changeData(this.#movie);
        }
      }});

    if (prevPopupComponent === null) {
      render(this.#popupComponent, this.#root);
    } else {
      replace(this.#popupComponent, prevPopupComponent);
    }
    this.#popupComponent.addEvents(this.#closeModal);
  };
}

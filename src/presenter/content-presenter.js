import {render} from '../framework/render';
import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/film-card-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import PopupView from '../view/popup-movie-details-view';
import NoFilmView from '../view/no-film-view';

const siteBodyNode = document.querySelector('body');
const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');
const getFilmCard = () => getFilmList().querySelector('.films-list__container');

const FILM_COUNT_PER_STEP = 5;
const MAX_COUNT_FILMS_IN_LIST = 2;

export default class ContentPresenter {
  #movieModel = null;
  #movies = [];
  #showMoreButtonComponent = new ButtonShowMoreView();
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  constructor(movieModel) {
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.movies];
    this.#renderBoard();
  };

  #handleShowMoreButtonClick = () => {
    this.#movies
      .slice(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#movies.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #renderMovie = (movie) => {
    const movieComponent = new MovieCardView(movie);
    const popupComponent = new PopupView(movie);

    // TODO: убрать утечку памяти при нажатии на Esc - удалять обработчик события клика на кнопку закрытия.
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        siteBodyNode.removeChild(popupComponent.element);
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const appendPopupToBody = () => {
      render(popupComponent, siteBodyNode);

      const closeButton = popupComponent.element.querySelector('.film-details__close-btn');

      function closePopup () {
        closeButton.removeEventListener('click', closePopup);
        document.removeEventListener('keydown', onEscKeyDown);
        siteBodyNode.removeChild(popupComponent.element);
      }

      closeButton.addEventListener('click', closePopup);

    };

    movieComponent.setFilmClickHandler(() => {
      appendPopupToBody();
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(movieComponent, getFilmCard());
  };

  #renderBoard = () => {
    render(new MovieListView(this.#movies), siteMainNode);

    if(this.#movies.length === 0) {
      render(new NoFilmView(), getFilmList());
    } else {

      for (let i = 0; i < Math.min(this.#movies.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.#movies[i]);
      }

      // Добавит кнопку в конце списка фильмов
      if(this.#movies.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, getFilmList());

        this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }

      // Добавит популярные фильмы
      render(new TopFilmsView(), getFilmSection());
      const topFilmsNode = document.querySelector('.films-list__container--top-films');
      for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
        render(new MovieCardView(this.#movies[i]), topFilmsNode);
      }

      // Добавит наиблее комментируемые фильмы
      render(new MostCommentedFilmsView(), getFilmSection());
      const mostCommentedFilmsNode = document.querySelector('.films-list__container--most-commented');
      for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
        render(new MovieCardView(this.#movies[i]), mostCommentedFilmsNode);
      }
    }
  };
}

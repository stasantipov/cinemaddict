import {render, remove} from '../framework/render';
import SortView from '../view/list-sort-view';
import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/film-card-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import NoFilmView from '../view/no-film-view';
import FilmPresenter from './film-presenter';
import ModalPresenter from './modal-presenter';
import {updateItem} from '../util';
import {SortType} from '../view/list-sort-view';

const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');
const getFilmCard = () => getFilmList().querySelector('.films-list__container');

const FILM_COUNT_PER_STEP = 5;
const MAX_COUNT_FILMS_IN_LIST = 2;

export default class ContentPresenter {
  #movieModel = null;
  #isModalOpen = false;
  #movies = [];
  #sourcedFilms = [];
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;

  #showMoreButtonComponent = new ButtonShowMoreView();
  #sortComponent = new SortView(this.#currentSortType);
  #modalPresenter = null;

  #filmPresenter = new Map();

  constructor(movieModel) {
    this.#movieModel = movieModel;
  }

  init = () => {
    this.#movies = [...this.#movieModel.movies];
    this.#sourcedFilms = [...this.#movieModel.movies];
    this.#renderSort();
    this.#renderBoard();
  };

  #closeModal = () => {
    this.#isModalOpen = false;
    const root = document.querySelector('.film-details');
    document.body.removeChild(root);
    document.body.classList.remove('hide-overflow');
  };

  #openModal = (movie) => {
    this.#isModalOpen = true;
    this.#modalPresenter = new ModalPresenter({
      closeModal: this.#closeModal,
      onChange: this.#handleFilmChange
    });
    this.#modalPresenter.init(movie);
    document.body.classList.add('hide-overflow');
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

  #handleModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleFilmChange = (updatedFilm) => {
    this.#movies = updateItem(this.#movies, updatedFilm);
    this.#sourcedFilms = updateItem(this.#sourcedFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
    if (this.#isModalOpen) {
      this.#modalPresenter.init(updatedFilm);
    }
  };

  #sortFilms = (sortType) => {
    switch (sortType) {
      case SortType.SORT_BY_RATING:
        this.#movies.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
        break;
      case SortType.SORT_BY_DATE:
        this.#movies.sort((a, b) => a.filmInfo.totalRating - b.filmInfo.totalRating);
        break;
      default:
        this.#movies = [...this.#sourcedFilms];
    }

    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortFilms(sortType);
    this.#clearFilmList();
    this.#renderBoard();

  };

  #renderSort = () => {
    render(this.#sortComponent, siteMainNode);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #renderMovie = (movie) => {
    const filmPresenter = new FilmPresenter({
      rootNode: getFilmCard(),
      onChange: this.#handleFilmChange,
      openModal: this.#openModal,
      closeModal: this.#closeModal
    });
    filmPresenter.init(movie);
    this.#filmPresenter.set(movie.id, filmPresenter);
  };

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
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

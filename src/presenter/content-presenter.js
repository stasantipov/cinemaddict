import {render, remove} from '../framework/render';
import UserNameView from '../view/user-name-view';
import SortView from '../view/list-sort-view';
import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/film-card-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import NoFilmView from '../view/no-film-view';
import StatisticsView from '../view/statistics-view';
import FilmPresenter from './film-presenter';
import ModalPresenter from './modal-presenter';
import {SortType} from '../view/list-sort-view';
import {UpdateType, UserAction, filter, FilterType} from '../const';
import CommentsModel from '../model/comments-model';
import {sortFilmsByDateDown} from '../util';

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');
const getFilmCard = () => getFilmList().querySelector('.films-list__container');
const siteFooterNode = document.querySelector('.footer__statistics');

const FILM_COUNT_PER_STEP = 5;
const MAX_COUNT_FILMS_IN_LIST = 2;

export default class ContentPresenter {
  #movieModel = null;
  #isModalOpen = false;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filterModel = null;
  #userNameComponent = null;

  #showMoreButtonComponent = new ButtonShowMoreView();
  #sortComponent = new SortView(this.#currentSortType);
  #topFilmsComponent = new TopFilmsView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #commentsModel = null;
  #modalPresenter = null;

  #filmPresenter = new Map();

  constructor(movieModel, filterModel) {
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;

    this.#movieModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get movies() {
    const movies = this.#movieModel.movies;
    const filterType = this.#filterModel.filter;
    const filteredMovies = filter[filterType](movies);

    switch (this.#currentSortType) {
      case SortType.DEFAULT:
        return filteredMovies;
      case SortType.SORT_BY_RATING:
        return filteredMovies.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      case SortType.SORT_BY_DATE:
        return filteredMovies.sort(sortFilmsByDateDown);
    }

    return filteredMovies;
  }

  init = () => {
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
    this.#commentsModel = new CommentsModel(movie);
    this.#modalPresenter = new ModalPresenter({
      closeModal: this.#closeModal,
      onChange: this.#handleViewAction,
      handleModelEvent: this.#handleModelEvent,
      commentsModel: this.#commentsModel
    });
    this.#modalPresenter.init(movie);
    document.body.classList.add('hide-overflow');
  };

  #renderMovie = (movie) => {
    const filmPresenter = new FilmPresenter({
      rootNode: getFilmCard(),
      onChange: this.#handleViewAction,
      openModal: this.#openModal,
      closeModal: this.#closeModal
    });
    filmPresenter.init(movie);
    this.#filmPresenter.set(movie.id, filmPresenter);
  };

  #handleShowMoreButtonClick = () => {
    const Allmovies = [...this.#movieModel.movies];
    const movieCount = Allmovies.length;
    const newRenderedMoviesCount =  Math.min(movieCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const movies = Allmovies.slice(this.#renderedFilmCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedFilmCount = newRenderedMoviesCount;

    if (this.#renderedFilmCount >= movieCount) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #handleViewAction = ({actionType, event, payload}) => {
    if(!event || !payload) {
      throw new Error (`Недопустимо - ${event} , ${payload}`);
    }

    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#movieModel.updateFilm(event, payload);
        break;
      case UserAction.UPDATE_MODAL:
        this.#movieModel.updateFilm(event, payload);
        this.#modalPresenter.init(payload);
        break;
      case UserAction.ADD_COMMENT:
        this.#commentsModel.addComment(event, payload);
        break;
      case UserAction.DELETE_COMMENT:
        this.#commentsModel.deleteComment(event, payload);
        break;
      default: {
        throw new Error (`Недопустимый тип actionType - ${actionType}`);
      }
    }
  };

  #handleModelEvent = (event, payload) => {
    switch (event) {
      case UpdateType.PATCH:
        this.#filmPresenter.get(payload.id).init(payload);
        if (this.#isModalOpen) {
          this.#modalPresenter.init(payload);
        }
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if (this.#isModalOpen) {
          this.#modalPresenter.init(payload);
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderBoard({renderedFilmCount: true, resetSortType: true});
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard({renderedFilmCount: true});
    this.#renderBoard();

  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(this.#sortComponent, siteMainNode);
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderBoard = () => {
    this.#renderUserTitle();
    this.#renderMovieList();
    this.#renderTopFilms();
    this.#renderMostCommendetFilms();
    this.#renderStatisticsMovies();
  };

  #renderUserTitle = () => {
    const movies = this.#movieModel.movies;
    const watchedMoviesCount = filter[FilterType.HISTORY](movies).length;

    this.#userNameComponent = new UserNameView(watchedMoviesCount);

    if (this.#userNameComponent) {
      remove(this.#userNameComponent);
    }

    render(this.#userNameComponent, siteHeaderNode);
  };

  #renderMovieList =() => {
    const movies = this.movies;
    const moviesCount = movies.length;

    render(new MovieListView(movies), siteMainNode);

    if(moviesCount === 0) {
      this.#renderNoFilms();
    } else {

      for (let i = 0; i < Math.min(moviesCount, FILM_COUNT_PER_STEP); i++) {
        this.#renderMovie(movies[i]);
      }

      // Добавит кнопку в конце списка фильмов
      if(moviesCount > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, getFilmList());

        this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }
    }
  };

  #renderNoFilms = () => {
    render(new NoFilmView(), getFilmList());
  };

  #renderTopFilms = () => {
    render(this.#topFilmsComponent, getFilmSection());
    const topFilmsNode = document.querySelector('.films-list__container--top-films');
    const movies = [...this.#movieModel.movies];
    for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
      render(new MovieCardView(movies[i]), topFilmsNode);
    }
  };

  #renderMostCommendetFilms = () => {
    render(this.#mostCommentedFilmsComponent, getFilmSection());
    const mostCommentedFilmsNode = document.querySelector('.films-list__container--most-commented');
    const movies = [...this.#movieModel.movies];
    for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
      render(new MovieCardView(movies[i]), mostCommentedFilmsNode);
    }
  };

  #clearBoard = ({renderedFilmCount = false, resetSortType = false} = {}) => {
    const movies = [...this.#movieModel.movies];
    const moviesCount = movies.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#userNameComponent);
    remove(this.#topFilmsComponent);
    remove(this.#mostCommentedFilmsComponent);
    remove(this.#showMoreButtonComponent);

    if (renderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(moviesCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
  };

  #renderStatisticsMovies = () => {
    render(new StatisticsView(this.movies), siteFooterNode);
  };
}

import {render, remove, replace} from '../framework/render';
import UserNameView from '../view/user-name-view';
import ListSortView from '../view/list-sort-view';
import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/movie-card-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import NoFilmView from '../view/no-film-view';
import StatisticsView from '../view/statistics-view';
import LoadingView from '../view/loading-view';
import FilmPresenter from './film-presenter';
import ModalPresenter from './modal-presenter';
import {KeyCode, UpdateType, UserAction, filter, FilterType, SortType} from '../const';
import CommentsModel from '../model/comments-model';
import {sortFilmsByDateDown} from '../utils';

const FILM_COUNT_PER_STEP = 5;
const MAX_COUNT_FILMS_IN_LIST = 2;

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');
const getFilmCard = () => getFilmList().querySelector('.films-list__container');
const siteButtonDeleteNode = document.querySelectorAll('.film-details__comment-delete');
siteButtonDeleteNode.textContent = 'Delete';
siteButtonDeleteNode.disabled = false;
const siteFooterNode = document.querySelector('.footer__statistics');

export default class ContentPresenter {
  #isModalOpen = false;
  #currentSortType = SortType.DEFAULT;
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #isLoading = true;
  #moviesApiService = null;

  #movieModel = null;
  #filterModel = null;
  #commentsModel = null;

  #userNameComponent = null;
  #showMoreButtonComponent = new ButtonShowMoreView();
  #sortComponent = null;
  #topFilmsComponent = new TopFilmsView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #loadingComponent = new LoadingView();
  #movieListComponent = null;
  #statisticsComponent = null;

  #modalPresenter = null;
  #filmPresenter = new Map();

  constructor(movieModel, filterModel, moviesApiService) {
    this.#movieModel = movieModel;
    this.#filterModel = filterModel;
    this.#moviesApiService = moviesApiService;

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
    this.#modalPresenter.destroy();
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #openModal = (movie) => {
    if(this.#isModalOpen) {
      this.#modalPresenter.destroy();
    }
    this.#isModalOpen = true;
    this.#commentsModel = new CommentsModel(this.#moviesApiService);
    this.#modalPresenter = new ModalPresenter({
      closeModal: this.#closeModal,
      onChange: this.#handleViewAction,
      handleModelEvent: this.#handleModelEvent,
      commentsModel: this.#commentsModel
    });
    this.#modalPresenter.init({movie, comments: []});
    document.body.classList.add('hide-overflow');
    this.#commentsModel.init(movie);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.keyCode === KeyCode.ESC) {
      this.#closeModal(this.#escKeyDownHandler);
    }
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
    const newRenderedMoviesCount =  Math.min(this.movies.length, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const movies = this.movies.slice(this.#renderedFilmCount, newRenderedMoviesCount);

    this.#renderMovies(movies);
    this.#renderedFilmCount = newRenderedMoviesCount;

    if (this.#renderedFilmCount >= this.movies.length) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #handleViewAction = async ({actionType, event, payload}) => {

    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this.#movieModel.updateFilm(event, payload);
        break;
      case UserAction.UPDATE_MODAL:
        this.#movieModel.updateFilm(event, payload);
        this.#modalPresenter.init({movie: payload, comments: this.#commentsModel.comments});
        break;
      case UserAction.ADD_COMMENT:
        try {
          await this.#commentsModel.addComment(event, payload);
        } catch (err) {
          this.#modalPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_COMMENT:
        try {
          await this.#commentsModel.deleteComment(event, payload);
        } catch (err) {
          this.#modalPresenter.handleCommentError();
        }
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
          this.#modalPresenter.init({movie: payload, comments: this.#commentsModel.comments});
        }
        this.#renderUserTitle();
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        if (this.#isModalOpen) {
          this.#modalPresenter.init({movie: payload, comments: this.#commentsModel.comments});
        }
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({renderedFilmCount: true, resetSortType: true});
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.INIT_COMMENTS:
        this.#modalPresenter.init({
          movie: payload,
          comments: this.#commentsModel.comments
        });
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
    this.#renderSort();
  };

  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new ListSortView(this.#currentSortType);
    this.#sortComponent.setSortTypeClickHandler(this.#handleSortTypeChange);

    if (prevSortComponent === null) {
      render(this.#sortComponent, siteMainNode);
    } else {
      replace(this.#sortComponent, prevSortComponent);
    }
  };

  #renderMovies = (movies) => {
    movies.forEach((movie) => this.#renderMovie(movie));
  };

  #renderLoading = () => {
    render(this.#loadingComponent, siteMainNode);
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    this.#renderSort();
    this.#renderUserTitle();
    this.#renderMovieList();
    this.#renderTopFilms();
    this.#renderMostCommendetFilms();
    this.#renderStatisticsMovies();
  };

  #renderUserTitle = () => {
    const watchedMoviesCount = filter[FilterType.HISTORY](this.#movieModel.movies).length;

    const prevUserTitleComponent = this.#userNameComponent;

    this.#userNameComponent = new UserNameView(watchedMoviesCount);

    if (prevUserTitleComponent === null) {
      render(this.#userNameComponent, siteHeaderNode);
    } else {
      replace(this.#userNameComponent, prevUserTitleComponent);
    }
  };

  #renderMovieList =() => {
    this.#movieListComponent = new MovieListView(this.movies);
    render(this.#movieListComponent, siteMainNode);

    if(this.movies.length === 0) {
      this.#renderNoFilms();
    } else {

      for (let i = 0; i < Math.min(this.movies.length, FILM_COUNT_PER_STEP); i++) {
        this.#renderMovie(this.movies[i]);
      }

      // Добавит кнопку в конце списка фильмов
      if(this.movies.length > FILM_COUNT_PER_STEP) {
        render(this.#showMoreButtonComponent, getFilmList());

        this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
      }
    }
  };

  #renderNoFilms = () => {
    render(new NoFilmView(), getFilmList());
  };

  #renderTopFilms = () => {
    if (this.#movieModel.movies.length !== 0) {
      render(this.#topFilmsComponent, getFilmSection());
      const topFilmsNode = document.querySelector('.films-list__container--top-films');
      const movies = [...this.#movieModel.movies];
      movies.sort((a, b) => b.filmInfo.totalRating - a.filmInfo.totalRating);
      for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
        render(new MovieCardView(movies[i]), topFilmsNode);
      }
    }
  };

  #renderMostCommendetFilms = () => {
    if (this.#movieModel.movies.length !== 0) {
      render(this.#mostCommentedFilmsComponent, getFilmSection());
      const mostCommentedFilmsNode = document.querySelector('.films-list__container--most-commented');
      const movies = [...this.#movieModel.movies];
      movies.sort((a, b) => b.comments.length - a.comments.length);
      for (let i = 0; i < MAX_COUNT_FILMS_IN_LIST; i++) {
        render(new MovieCardView(movies[i]), mostCommentedFilmsNode);
      }
    }
  };

  #clearBoard = ({renderedFilmCount = false, resetSortType = false} = {}) => {
    const moviesCount = this.movies.length;

    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();

    remove(this.#loadingComponent);
    remove(this.#movieListComponent);
    remove(this.#topFilmsComponent);
    remove(this.#mostCommentedFilmsComponent);
    remove(this.#showMoreButtonComponent);
    remove(this.#statisticsComponent);

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
    this.#statisticsComponent = new StatisticsView(this.#movieModel.movies);
    render(this.#statisticsComponent, siteFooterNode);
  };
}

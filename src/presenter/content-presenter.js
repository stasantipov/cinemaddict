import MovieListView from '../view/movie-list-view';
import MovieCardView from '../view/film-card-view';
import ButtonShowMoreView from '../view/button-show-more-view';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import PopupView from '../view/popup-movie-details-view';
import {render} from '../render';

const siteBodyNode = document.querySelector('body');
const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');
const getFilmCard = () => getFilmList().querySelector('.films-list__container');


export default class ContentPresenter {
  #movieModel = null;
  #newMovies = [];
  // #movieListView = new MovieListView();

  init = (movieModel) => {
    this.#movieModel = movieModel;
    this.#newMovies = [...this.#movieModel.movies];

    render(new MovieListView(this.#newMovies), siteMainNode);

    // Добавит кнопку в конце списка фильмов
    render(new ButtonShowMoreView(), getFilmList());

    // Добавит популярные фильмы
    render(new TopFilmsView(), getFilmSection());
    const topFilmsNode = document.querySelector('.films-list__container--top-films');

    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(this.#newMovies[i]), topFilmsNode);
    }

    // Добавит наиблее комментируемые фильмы
    render(new MostCommentedFilmsView(), getFilmSection());
    const mostCommentedFilmsNode = document.querySelector('.films-list__container--most-commented');

    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(this.#newMovies[i]), mostCommentedFilmsNode);
    }

    for (let i = 0; i < this.#newMovies.length; i++) {
      this.#renderMovie(this.#newMovies[i]);
    }
  };

  #renderMovie = (movie) => {
    const movieComponent = new MovieCardView(movie);
    const popupComponent = new PopupView(movie);

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

    movieComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
      appendPopupToBody();
      document.addEventListener('keydown', onEscKeyDown);
    });

    render(movieComponent, getFilmCard());
  };
}

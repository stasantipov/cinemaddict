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

  init = (movieModel) => {
    this.movieModel = movieModel;
    this.newMovies = [...this.movieModel.getMovies()];

    render(new MovieListView(this.newMovies), siteMainNode);

    // Добавит фильмы в список
    this.newMovies.forEach((el) => {
      render(new MovieCardView(el), getFilmCard());
    });

    // Добавит кнопку в конце списка фильмов
    render(new ButtonShowMoreView(), getFilmList());

    // Добавит популярные фильмы
    render(new TopFilmsView(), getFilmSection());
    const topFilmsNode = document.querySelector('.films-list__container--top-films');

    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(this.newMovies[i]), topFilmsNode);
    }

    // Добавит наиблее комментируемые фильмы
    render(new MostCommentedFilmsView(), getFilmSection());
    const mostCommentedFilmsNode = document.querySelector('.films-list__container--most-commented');

    for (let i = 0; i < 2; i++) {
      render(new MovieCardView(this.newMovies[i]), mostCommentedFilmsNode);
    }

    // Попап с подробной инф-ей о фильме
    this.newMovies.forEach((el) => {
      render(new PopupView(el), siteBodyNode);
    });
  };
}



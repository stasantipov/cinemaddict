import MovieListView from '../view/movie-list-view';
import ButtonShowMoreView from '../view/button-show-more-view.js';
import TopFilmsView from '../view/top-films-list-view';
import MostCommentedFilmsView from '../view/most-commented-films-view';
import PopupView from '../view/popup-movie-details-view';
import {render} from '../render.js';

const siteBodyNode = document.querySelector('body');
const siteMainNode = document.querySelector('.main');
const getFilmSection = () => siteMainNode.querySelector('.films');
const getFilmList = () => getFilmSection().querySelector('.films-list');


export default class ContentPresenter {

  init = () => {
    render(new MovieListView(), siteMainNode);
    render(new ButtonShowMoreView(), getFilmList());
    render(new TopFilmsView(), getFilmSection());
    render(new MostCommentedFilmsView(), getFilmSection());
    render(new PopupView(), siteBodyNode);
  };
}

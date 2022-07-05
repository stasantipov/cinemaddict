import FilterView from './view/list-filter-view.js';
import UserNameView from './view/user-name-view.js';
import NavigationView from './view/navigation-view';
import StatisticsView from './view/statistics-view';
import {render} from './render.js';
import ContentPresenter from './presenter/content-presenter';
import MovieModel from './model/movie-model.js';

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');
const siteFooterNode = document.querySelector('.footer__statistics');

const movieModel = new MovieModel();
const contentPresenter = new ContentPresenter();

render(new UserNameView(), siteHeaderNode);
render(new NavigationView(), siteMainNode);
render(new FilterView(), siteMainNode);
render(new StatisticsView(), siteFooterNode);

contentPresenter.init(movieModel);

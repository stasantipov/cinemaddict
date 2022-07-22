import {render} from './framework/render';
import FilterView from './view/list-filter-view';
import UserNameView from './view/user-name-view';
import NavigationView from './view/navigation-view';
import StatisticsView from './view/statistics-view';
import ContentPresenter from './presenter/content-presenter';
import MovieModel from './model/movie-model';
import {generateFilter} from './mock/filter';

const siteHeaderNode = document.querySelector('.header');
const siteMainNode = document.querySelector('.main');
const siteFooterNode = document.querySelector('.footer__statistics');

const movieModel = new MovieModel();
const contentPresenter = new ContentPresenter(movieModel);

const filters = generateFilter(movieModel.movies);

render(new UserNameView(), siteHeaderNode);
render(new NavigationView(filters), siteMainNode);
render(new FilterView(), siteMainNode);
render(new StatisticsView(), siteFooterNode);

contentPresenter.init();

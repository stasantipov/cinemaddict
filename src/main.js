import ContentPresenter from './presenter/content-presenter';
import FilterPresenter from './presenter/filter-presenter.js';
import MovieModel from './model/movie-model';
import FilterModel from './model/filter-model.js';

const siteMainNode = document.querySelector('.main');

const movieModel = new MovieModel();
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(movieModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainNode, filterModel, movieModel);

filterPresenter.init();
contentPresenter.init();

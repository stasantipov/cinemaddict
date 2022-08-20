import ContentPresenter from './presenter/content-presenter';
import FilterPresenter from './presenter/filter-presenter';
import MovieModel from './model/movie-model';
import FilterModel from './model/filter-model';
import MoviesApiService from './movie-api-service';

const AUTHORIZATION = 'Basic kfb47finibis47hihci49';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteMainNode = document.querySelector('.main');

const moviesApiService = new MoviesApiService(END_POINT, AUTHORIZATION);

const movieModel = new MovieModel(moviesApiService);
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(movieModel, filterModel, moviesApiService);
const filterPresenter = new FilterPresenter(siteMainNode, filterModel, movieModel);

filterPresenter.init();
contentPresenter.init();
movieModel.init();

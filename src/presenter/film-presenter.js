import {render, replace} from '../framework/render';
import MovieCardView from '../view/film-card-view';

// import {humanizeFilmDueDate} from '../util.js';
// import {nanoid} from 'nanoid';
// import { dateComment} from '../mock/data';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #openModal = null;

  #movieComponent = null;

  #movie = null;

  constructor({rootNode, onChange, openModal}) {
    this.#filmListContainer = rootNode;
    this.#changeData = onChange;
    this.#openModal = openModal;
  }

  init = (movie) => {
    this.#movie = movie;

    const prevFilmComponent = this.#movieComponent;

    this.#movieComponent = new MovieCardView(movie);

    this.#movieComponent.setFilmClickHandler(() => {
      this.#openModal(this.#movie);
    });

    this.#movieComponent.setWatchlistClickHandler(this.#handleWatchListClick);
    this.#movieComponent.setWatchedClickHandler(this.#handleWatchedClick);
    this.#movieComponent.setFavoriteClickHandler(this.#handleFavoriteClick);


    if (prevFilmComponent === null) {
      render(this.#movieComponent, this.#filmListContainer);
    } else {
      replace(this.#movieComponent, prevFilmComponent);
    }
  };

  #handleWatchListClick = () => {
    this.#movie.filmInfo.userDetails.watchlist = !this.#movie.filmInfo.userDetails.watchlist;
    this.#changeData(this.#movie);
  };

  #handleWatchedClick = () => {
    this.#movie.filmInfo.userDetails.alreadyWatched = !this.#movie.filmInfo.userDetails.alreadyWatched;
    this.#changeData(this.#movie);
  };

  #handleFavoriteClick = () => {
    this.#movie.filmInfo.userDetails.favorite = !this.#movie.filmInfo.userDetails.favorite;
    this.#changeData(this.#movie);
  };
}

import {render, replace, remove} from '../framework/render';
import {UserAction, UpdateType} from '../const.js';
import MovieCardView from '../view/film-card-view';

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

  destroy = () => remove(this.#movieComponent);

  #handleWatchListClick = () => {
    this.#changeData({
      actionType: UserAction.UPDATE_CARD,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        filmInfo: {
          ...this.#movie.filmInfo,
          userDetails: {
            ...this.#movie.filmInfo.userDetails,
            watchlist: !this.#movie.filmInfo.userDetails.watchlist
          }
        },
      }
    });
  };

  #handleWatchedClick = () => {
    this.#changeData({
      actionType: UserAction.UPDATE_CARD,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        filmInfo: {
          ...this.#movie.filmInfo,
          userDetails: {
            ...this.#movie.filmInfo.userDetails,
            alreadyWatched: !this.#movie.filmInfo.userDetails.alreadyWatched
          }
        },
      }
    });
  };

  #handleFavoriteClick = () => {
    this.#changeData({
      actionType: UserAction.UPDATE_CARD,
      event: UpdateType.PATCH,
      payload: {
        ...this.#movie,
        filmInfo: {
          ...this.#movie.filmInfo,
          userDetails: {
            ...this.#movie.filmInfo.userDetails,
            favorite: !this.#movie.filmInfo.userDetails.favorite
          }
        },
      }
    });
  };
}

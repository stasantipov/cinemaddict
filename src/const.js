const UserAction = {
  UPDATE_CARD: 'UPDATE_CARD',
  UPDATE_MODAL: 'UPDATE_MODAL',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT'
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_COMMENTS: 'INIT_COMMENTS'
};

const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

const filter = {
  [FilterType.ALL]: (movies) => movies,
  [FilterType.WATCHLIST]: (movies) => movies.filter((el) => el.filmInfo.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((el) => el.filmInfo.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((el) => el.filmInfo.userDetails.favorite)
};

const UserTitle = {
  NOVICE: 'Novice',
  FAN: 'Fan',
  BUFF: 'Movie Buff'
};

const SortType = {
  DEFAULT: 'default',
  SORT_BY_DATE: 'date-down',
  SORT_BY_RATING: 'rating',
};

export {UserAction, UpdateType, filter, FilterType, UserTitle, SortType};

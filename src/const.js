const KeyCode = {
  ESC: 27,
  ENTER: 13
};

const UserAction = {
  UPDATE_CARD: 'UpdateCard',
  UPDATE_MODAL: 'UpdateModal',
  ADD_COMMENT: 'AddComment',
  DELETE_COMMENT: 'DeleteComment'
};

const UpdateType = {
  PATCH: 'Patch',
  MINOR: 'Minor',
  MAJOR: 'Major',
  INIT: 'Init',
  INIT_COMMENTS: 'InitComments'
};

const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites'
};

const filter = {
  [FilterType.ALL]: (movies) => Array.from(movies),
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

export {KeyCode, UserAction, UpdateType, filter, FilterType, UserTitle, SortType};

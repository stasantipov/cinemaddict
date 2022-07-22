import {getRandomNumber} from '../util.js';

const FilterType = {
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favoriets',
};

const filter = {
  [FilterType.WATCHLIST]: (movies) => movies.filter((el) => el.filmInfo.userDetails.watchlist),
  [FilterType.HISTORY]: (movies) => movies.filter((el) => el.filmInfo.userDetails.alreadyWatched),
  [FilterType.FAVORITES]: (movies) => movies.filter((el) => el.filmInfo.userDetails.favorite),
};

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterName, filterMovies]) => ({
    name: filterName,
    count: getRandomNumber(0, filterMovies(movies).length),
  })
);

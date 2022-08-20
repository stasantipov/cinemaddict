import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'})
      .then(ApiService.parseResponse);
  }

  updateFilm = async (film) => {
    const response = await this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  getComments = async (film) => {
    const respons = await this._load({url: `${'comments'}/${film.id}`})
      .then(ApiService.parseResponse);

    return respons;
  };

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'film_info': {
        ...film.filmInfo,
        'age_rating': film.filmInfo.ageRating,
        'total_rating': film.filmInfo.totalRating,
        'alternative_title': film.filmInfo.alternativeTitle,
        'release': {
          'date': film.filmInfo.release.date,
          'release_country': film.filmInfo.release.releaseCountry,
        }
      },
      'user_details': {
        ...film.filmInfo.userDetails,
        'already_watched': film.filmInfo.userDetails.alreadyWatched,
        'watching_date': film.filmInfo.userDetails.watchingDate,
      },
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.userDetails;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.release.releaseCountry;
    delete adaptedFilm.user_details.watchingDate;
    delete adaptedFilm.user_details.alreadyWatched;

    return adaptedFilm;
  };
}

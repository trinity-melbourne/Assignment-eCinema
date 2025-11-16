/**
 * Movie model
 * Lightweight wrapper around TMDB movie data returned from the API.
 * Provides helpers to build image URLs and format short summaries.
 *
 * Usage:
 *   const m = new Movie(apiData);
 *   m.getPosterUrl();
 */
export class Movie {
  /**
   * Construct a Movie instance from raw API data.
   * @param {Object} data - raw movie object from TMDB API
   */
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.originalTitle = data.original_title;
    this.overview = data.overview;
    this.releaseDate = data.release_date;
    this.originalLanguage = data.original_language;
    this.posterPath = data.poster_path;
    this.backdropPath = data.backdrop_path;
    this.genreIds = data.genre_ids || [];
    this.popularity = data.popularity;
    this.voteAverage = data.vote_average;
    this.voteCount = data.vote_count;
    this.adult = data.adult;
    this.video = data.video;
  }
  /**
   * Build the full URL to the poster image hosted by TMDB.
   * @param {string} [size='w500'] - TMDB image size token (e.g. 'w200','w500')
   * @returns {string|null} absolute image URL or null if no poster is available
   */
  getPosterUrl(size = "w500") {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${this.posterPath}`;
  }

  /**
   * Build the full URL to the backdrop image hosted by TMDB.
   * @param {string} [size='w780'] - TMDB image size token
   * @returns {string|null} absolute backdrop URL or null if not available
   */
  getBackdropUrl(size = "w780") {
    if (!this.backdropPath) return null;
    return `https://image.tmdb.org/t/p/${size}${this.backdropPath}`;
  }

  /**
   * Return a short, human-readable summary for display in lists.
   * @returns {string} short summary including title, release year and rating
   */
  getShortSummary() {
    return `${this.title} (${this.releaseDate || "N/A"}) - Rating: ${this.voteAverage}`;
  }
}

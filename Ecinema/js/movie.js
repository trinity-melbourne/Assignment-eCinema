/**
 * Movie model - lightweight representation of a TMDB movie
 *
 * Only properties required by the UI (showMovies) are kept:
 *  - id, title, releaseDate, voteAverage, overview, posterPath
 *
 * Methods:
 *  - getPosterUrl(size)  -> returns full poster URL or null
 *  - getShortSummary()    -> brief summary string
 */
export class Movie {
  /**
   * @param {object} data - raw TMDB movie object
   */
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title || data.original_title || "Untitled";
    this.releaseDate = data.release_date || null;
    this.voteAverage = data.vote_average ?? null;
    this.overview = data.overview || "";
    // keep posterPath because getPosterUrl() uses it and showMovies displays poster
    this.posterPath = data.poster_path || null;
  }

  /**
   * Return a complete poster image URL or null if no poster is available.
   * @param {string} [size='w342'] - TMDB image size token (e.g. 'w185','w342','original')
   * @returns {string|null}
   */
  getPosterUrl(size = "w342") {
    if (!this.posterPath) return null;
    return "https://image.tmdb.org/t/p/" + size + this.posterPath;
  }

  /**
   * Return a short summary (safely truncated) for card display.
   * @param {number} [maxChars=200]
   * @returns {string}
   */
  getShortSummary(maxChars = 200) {
    if (!this.overview) return "No description available.";
    return this.overview.length > maxChars ? this.overview.slice(0, maxChars) + "..." : this.overview;
  }
}

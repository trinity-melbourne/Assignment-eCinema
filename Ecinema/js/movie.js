export class Movie {
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

  getPosterUrl(size = "w500") {
    if (!this.posterPath) return null;
    return `https://image.tmdb.org/t/p/${size}${this.posterPath}`;
  }

  getBackdropUrl(size = "w780") {
    if (!this.backdropPath) return null;
    return `https://image.tmdb.org/t/p/${size}${this.backdropPath}`;
  }

  getShortSummary() {
    return `${this.title} (${this.releaseDate || "N/A"}) - Rating: ${this.voteAverage}`;
  }
}

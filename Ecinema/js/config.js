/**
 * Application configuration
 * Exports an object with keys used by the app. Replace TOKEN with your
 * own TMDB bearer token for API access when deploying or testing.
 *
 * Shape:
 * {
 *   API_URL: string, // base URL for TMDB API
 *   TOKEN: string    // bearer token for Authorization header
 * }
 */
export default {
  API_URL: "https://api.themoviedb.org/3",
  TOKEN:
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMzRhNGM5ZDRhMDhjNzAwNzJhZmZjYTI4ZGEwMzVmYyIsIm5iZiI6MTc2MTQzNDg2NC4zMTgsInN1YiI6IjY4ZmQ1Y2YwZTMxYTY4Mzk2MTNiZjgzOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.QztYQcMj_liIxaf5dBCDVGAmfVVXzSaqnywDHPPEFj4",
};

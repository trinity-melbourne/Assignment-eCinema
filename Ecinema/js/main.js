//Imports
import config from "./config.js";
import { Movie } from "./movie.js";

//  disabling form submissions if there are invalid fields
(() => {
  "use strict";

  const forms = document.querySelectorAll(".needs-validation");

  Array.from(forms).forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }

      form.classList.add("was-validated");
    });
  });
})();

//
async function search() {
  console.log("inside search");

  const q = document.getElementById("q").value.trim();

  const spinner = document.getElementById("spinner");
  spinner.classList.remove("d-none"); // show spinner

  try {
    const response = await fetch(
      config.API_URL + `/search/movie?query=${encodeURIComponent(q)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.TOKEN}`,
        },
      }
    );

    const data = await response.json();

    const movies = data.results.map((movieData) => new Movie(movieData));

    showMovies(movies);
  } catch (error) {
    console.log(error);
  } finally {
    spinner.classList.add("d-none"); // hide spinner after API completes
  }
}

const loadBtn = document.getElementById("loadBtn");
loadBtn.addEventListener("click", search);

// takes an array of your Movie objects and displays them
export function showMovies(movies) {
  const container = document.getElementById("movieList");
  container.innerHTML = ""; // clear old results

  if (!movies.length) {
    container.innerHTML = `<p class="text-muted">No movies found</p>`;
    return;
  }

  movies.forEach((movie) => {
    const poster = movie.getPosterUrl() ?? "../images/blank-poster.png";

    const card = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${poster}" class="card-img-top" alt="${movie.title}" />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.title}</h5>
            <p class="text-muted mb-1">Release: ${
              movie.releaseDate || "N/A"
            }</p>
            <p class="text-muted mb-2">Rating: ${movie.voteAverage}</p>

            <p class="card-text flex-grow-1" style="font-size: 0.9rem;">
              ${
                movie.overview.slice(0, 200) + "..." ||
                "No description available."
              }
            </p>

            <button class="btn btn-primary mt-auto w-100">
              More Info
            </button>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML("beforeend", card);
  });
}

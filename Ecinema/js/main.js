//Imports
import config from "./config.js";
import { Movie } from "./movie.js";

// replacing:
// const loadBtn = document.getElementById("loadBtn");
// if (loadBtn) loadBtn.addEventListener("click", search);

const $loadBtn = $("#loadBtn");
if ($loadBtn.length) $loadBtn.on("click", search);

const $contactBtn = $("#contactBtn");
if ($contactBtn.length) $contactBtn.on("click", contactUs);

function contactUs(event) {
  console.log("inside contact");

  $("#thankYouMsg").hide();

  // disabling form submissions if there are invalid fields
  const $form = $("#contact-us-form");
  const nativeForm = $form.get(0);
  if (nativeForm && !nativeForm.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    $form.addClass("was-validated");
    return false;
  }

  // show thank you message
  $("#thankYouMsg").show();
}

//
async function search(event) {
  console.log("inside search");
  // disabling form submissions if there are invalid fields
  const $form = $("#movie-search-form");
  const nativeForm = $form.get(0);
  if (nativeForm && !nativeForm.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    $form.addClass("was-validated");
    return false;
  }

  $form.addClass("was-validated");

  const q = $("#q").val().trim();

  const $spinner = $("#spinner");
  $spinner.removeClass("d-none"); // show spinner

  try {
    const response = await axios.get(`${config.API_URL}/search/movie`, {
      params: { query: q },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.TOKEN}`,
      },
    });

    const movies = (response.data.results || []).map((movieData) => new Movie(movieData));

    showMovies(movies);
  } catch (error) {
    console.log(error);
  } finally {
    $spinner.addClass("d-none"); // hide spinner after API completes
  }
}

// takes an array of your Movie objects and displays them
export function showMovies(movies) {
  const $container = $("#movieList");
  $container.html(""); // clear old results

  if (!movies.length) {
    $container.html(`<p class="text-muted">No movies found</p>`);
    return;
  }

  movies.forEach((movie) => {
    const poster = movie.getPosterUrl() ?? "./images/blank-poster.png";

    const card = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${poster}" class="card-img-top" alt="${movie.title}" />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.title}</h5>
            <p class="text-muted mb-1">Release: ${movie.releaseDate || "N/A"}</p>
            <p class="text-muted mb-2">Rating: ${movie.voteAverage}</p>

            <p class="card-text flex-grow-1" style="font-size: 0.9rem;">
              ${movie.overview.slice(0, 200) + "..." || "No description available."}
            </p>

            
          </div>
        </div>
      </div>
    `;

    $container.append(card);
  });
}

// Expose handlers to window in case inline handlers or other scripts expect them
window.search = search;
window.contactUs = contactUs;

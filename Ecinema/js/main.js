// Imports
import config from "./config.js";
import { Movie } from "./movie.js";

//* replacing:
// const loadBtn = document.getElementById("loadBtn");
// if (loadBtn) loadBtn.addEventListener("click", search);

const $loadBtn = $("#loadBtn");
if ($loadBtn.length) $loadBtn.on("click", search);

const $contactBtn = $("#contactBtn");
if ($contactBtn.length) $contactBtn.on("click", contactUs);

/**
 * Handle contact form submission.
 * Validates the form using the native checkValidity() API, stores the collected
 * data in localStorage and initiates a JSON file download with the submitted data.
 */
function contactUs(event) {
  console.log("inside contact");

  // hide any previous thank-you message
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

  // save form to local storage after receiving from function
  const formData = getFormData(nativeForm);
  console.log(formData);
  localStorage.setItem("contactFormData", JSON.stringify(formData));

  // Save form data to text file and download
  saveToFile(formData);

  // show thank you message
  const $thank = $("#thankYouMsg");
  $thank.show().attr("aria-hidden", "false");
  // move focus to thank-you message for screen readers
  $thank.get(0).focus?.();
}

/**
 * Collect values from a form element into a plain object keyed by element id.
 * Only elements with an id are included.
 *
 * @param form - native form element
 * @returns form data
 */
function getFormData(form) {
  const formData = {};
  debugger;
  const elements = form.elements;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.id) {
      formData[element.id] = element.value;
    }
  }
  return formData;
}

/**
 * Trigger a download of the provided formData as a JSON-formatted text file.
 * Uses a temporary anchor element and a Blob URL.
 *
 * @param formData - plain object to stringify and download
 */
function saveToFile(formData) {
  const dataStr = JSON.stringify(formData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "contactFormData.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Search handler: validates the search form, shows a spinner, calls the movie API
 * and renders results via showMovies.
 *
 * @param event - click event from the Search button
 */
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
  $spinner.attr("aria-hidden", "false");
  // mark results region busy for assistive tech
  $("#movieList").attr("aria-busy", "true");

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
    $spinner.attr("aria-hidden", "true");
    $("#movieList").attr("aria-busy", "false");
  }
}

/**
 * takes an array of your Movie objects and displays them
 * @param movies - array of Movie instances
 */
export function showMovies(movies) {
  const $container = $("#movieList");
  $container.html(""); // clear old results

  if (!movies.length) {
    $container.html(`<p class="text-muted">No movies found</p>`);
    return;
  }

  // Render each Movie instance as a Bootstrap card
  movies.forEach((movie) => {
    const poster = movie.getPosterUrl() ?? "./images/blank-poster.png";

    // Create accessible IDs for title and description so aria-labelledby can reference them
    const titleId = `movie-title-${movie.id}`;
    const descId = `movie-desc-${movie.id}`;

    const card = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm" role="article" aria-labelledby="${titleId}" aria-describedby="${descId}">
          <img src="${poster}" class="card-img-top" alt="Poster for ${movie.title}" />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title" id="${titleId}">${movie.title}</h5>
            <p class="text-muted mb-1">Release: ${movie.releaseDate || "N/A"}</p>
            <p class="text-muted mb-2">Rating: ${movie.voteAverage}</p>

            <p class="card-text flex-grow-1" id="${descId}" style="font-size: 0.9rem;">
              ${movie.overview ? movie.overview.slice(0, 200) + "..." : "No description available."}
            </p>

          </div>
        </div>
      </div>
    `;

    $container.append(card);
  });
}

/**
 * Ecinema Main JavaScript File
 *
 * Handles movie search, result rendering, and contact form processing
 * (validation, localStorage save, and download).
 */
// Imports
import config from "./config.js";
import { Movie } from "./movie.js";

/*********** Globals ***********/

//* replacing:
// const searchMovieBtn = document.getElementById("searchMovieBtn");
// if (searchMovieBtn) searchMovieBtn.addEventListener("click", search);

const $searchMovieBtn = $("#searchMovieBtn"); // get the Search button using cash.js
// check if searchMovieBtn exists because not all pages have it like contact us page
if ($searchMovieBtn.length) $searchMovieBtn.on("click", search); // attach search function (handler) to load button on click event

// check if contactBtn exists because not all pages have it like index.html page
const $contactBtn = $("#contactBtn"); // get the Contact button using cash.js
if ($contactBtn.length) $contactBtn.on("click", contactUs); // attach contactUs function to  button on click event

/*********** Movie Search - index.html ***********/

/**
 * Search handler: validates the search form, shows a spinner, calls the movie API
 * and renders results via showMovies.
 *
 * @param event - click event from the Search button
 */
async function search(event) {
  debugger;
  // async because we are using await inside
  console.log("inside search");

  // disabling form submissions if there are invalid fields
  const $form = $("#movie-search-form"); // get the form element using cash.js
  const nativeForm = $form.get(0); // get the native DOM form element from cash.js object so we can use checkValidity()
  if (nativeForm && !nativeForm.checkValidity()) {
    // check if form exists & checkValidity is method which returns true/false based on validity of form fields
    event.preventDefault(); // prevent default form submission behavior
    event.stopPropagation(); // stop event from bubbling up (spreading to other handlers)
    $form.addClass("was-validated"); // bootstrap class to show validation styles
    return false; // exit the function if form is invalid
  }

  $form.addClass("was-validated"); // bootstrap class to show validation styles

  const movieName = $("#movie-name").val().trim(); // get movie name (getElementById) from input field & trim whitespace

  // show spinner before calling api
  const $spinner = $("#spinner"); // get spinner element which is inside the search button
  $spinner.removeClass("d-none"); // show spinner by removing bootstrap d-none class
  debugger;
  try {
    // try-catch-finally to handle errors and ensure spinner is hidden
    const apiUrl = config.API_URL + "/search/movie"; // construct full API URL for searching movies
    const token = "Bearer " + config.TOKEN; // construct Authorization header value
    const response = await axios.get(
      apiUrl, // await allows to wait for promise to resolve
      {
        params: { query: movieName }, // query parameter for movie name
        headers: {
          "Content-Type": "application/json", // set content type header
          Authorization: token, // use constructed token
        },
      }
    );

    let movies = []; // array to hold Movie instances

    if (response.data.results) {
      // check if results exist in response
      console.log("API Response:", response.data.results); // log raw results for debugging
      for (let movie of response.data.results) {
        // get each movie from results
        console.log("Movie Title:", movie.title);
        const movieObj = new Movie(movie); // create Movie object/instance from raw movie data
        movies.push(movieObj); // add Movie instance to movies array
      }
    }
    console.log("Movies Array:", movies);

    showMovies(movies); // display movies as cards by calling showMovies function
  } catch (error) {
    // catch any errors during API call
    console.error("Error during movie search:", error);
  } finally {
    // finally block always executes
    // hide spinner after API completes
    $spinner.addClass("d-none"); // hide spinner by adding bootstrap d-none class
  }
}

/**
 * takes an array of your Movie objects and displays them as cards in the #movieList container.
 * @param movies - array of Movie instances
 */
export function showMovies(movies) {
  debugger;
  const $container = $("#movieList"); // get container (card-group) element for movie cards
  $container.html(""); // clear old results before showing new results

  if (!movies.length) {
    // check if movies array is empty
    $container.html(`<p class="text-muted">No movies found</p>`); // show no movies found message
    return; // exit the function if no movies to show
  }

  // Render each Movie instance as a Bootstrap card - loop for each Movie instance
  movies.forEach((movie) => {
    const poster = movie.getPosterUrl() ?? "./images/blank-poster.png"; // get poster URL or use placeholder image if null
    const card = `
      <div class="col-md-3 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${poster}" class="card-img-top" alt="Poster for ${movie.title}" />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${movie.title}</h5>
            <p class="text-muted mb-1">Release: ${movie.releaseDate || "N/A"}</p>
            <p class="text-muted mb-2">Rating: ${movie.voteAverage}</p>

            <p class="card-text flex-grow-1" style="font-size: 0.9rem;">
              ${movie.overview ? movie.overview.slice(0, 200) + "..." : "No description available."}
            </p>

          </div>
        </div>
      </div>
    `;

    $container.append(card); // append the card HTML to the container
  });
}

/*********** Contact Us ***********/

/**
 * Handle contact form submission.
 * Validates the form using the native checkValidity() API, stores the collected
 * data in localStorage and initiates a JSON file download with the submitted data.
 */
function contactUs(event) {
  debugger;
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

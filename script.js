'use strict';

let searchInput = document.querySelector('#search');

// Add keyPress event to the input value and call moviesRequest function
searchInput.addEventListener('keypress', function(event) {
    if (event.keyCode === 13) {
        let userSearch = searchInput.value;
        let movieUrl = "https://api.themoviedb.org/3/search/movie?api_key=47ea3cc0bdcaa1c0543e546e48b2f33b&language=en-US&query=" + userSearch + "&page=1&include_adult=false";

        moviesRequest(movieUrl);
    }
});

// Request to TMDB api to display youtube trailer
function movieTrailerRequest(id, image) {
  let xhrm = new XMLHttpRequest();

  xhrm.onreadystatechange = trailerMovie;

  function trailerMovie() {
    let DONE = 4;
    let OK = 200;
    if (xhrm.readyState === DONE) {
      if (xhrm.status === OK) {

        let response = JSON.parse(xhrm.response);
        let youtubeKey = response.results[0].key;

        let trailerUrl = "https://www.youtube.com/embed/"+youtubeKey+"?rel=0&autoplay=1";
        let videoPlayer = document.querySelector('.videoPlayer');
        let header = document.querySelector('.header');
        //Add click event to the document to close movie's trailer
        document.addEventListener('click', function(e) {
          if (e.target.className != 'movie-image') {
            videoPlayer.src = '';
            videoPlayer.style.display = 'none';
          }
        });

        //Add click event to movie's image to display movie's trailer
        image.addEventListener('click', function(e) {
          videoPlayer.src = trailerUrl;
          videoPlayer.style.display = 'block';
        });
      }
    }

  }
  let movieTrailerUrl = "https://api.themoviedb.org/3/movie/"+ id +"/videos?api_key=47ea3cc0bdcaa1c0543e546e48b2f33b&language=en-US";
  xhrm.open("GET", movieTrailerUrl, true);
  xhrm.send();
}


// Request to TMBD api passing as a parameter the user search
function moviesRequest(movieUrl)  {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = Callback;

    //
    function Callback() {
        let DONE = 4; //readyState 4 means the request is done.
        let OK = 200; // status 200 is a succesful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                let response = JSON.parse(xhr.response);

                let allMoviesSearched = response.results;
                allMoviesSearched.forEach(function(movie) {
                    let singleMovie = {
                        'title': movie.original_title,
                        'storyline': movie.overview,
                        'release_date': movie.release_date,
                        'vote_average': movie.vote_average,
                        'image': movie.poster_path,
                        'id': movie.id
                    }

                    let imageUrl = "https://image.tmdb.org/t/p/w500/" + singleMovie.image;
                    let movieTitle = document.createElement('h3');
                    movieTitle.innerHTML = singleMovie.title;

                    // Create a display with all the movies (users vote average greater than 3) with the string the user typed
                    if (singleMovie.vote_average > 3) {
                        let resultsContainer = document.querySelector('.results')
                        resultsContainer.appendChild(movieTitle);

                        //Add click event to the movie selected and create a movie card with all the movie info
                        movieTitle.addEventListener('click', function() {

                            //Create movie card
                            let movieCatalog = document.querySelector('.movie-catalog');
                            let movieCardElement = document.createElement('div');
                            movieCardElement.className = 'movie-card';
                            movieCatalog.appendChild(movieCardElement);

                            //After clicking a movie, delete showing title movies and clear search input
                            while (resultsContainer.firstChild) {
                                resultsContainer.removeChild(resultsContainer.firstChild);
                            }
                            searchInput.value = "";

                            // Create Movie image and append it to the card
                            let imageElement = document.createElement('div');
                            imageElement.className = 'movie-image';
                            imageElement.style.backgroundImage = 'url(' + imageUrl + ')';
                            movieCardElement.appendChild(imageElement);

                            //Create favorite Icon and display in the movie card
                            let favoriteElement = document.createElement('img');
                            favoriteElement.src = "img/favorite.svg";
                            favoriteElement.className = "favorite";
                            //Add click event to toggle favorite Icon
                            favoriteElement.addEventListener('click', function() {
                                if (favoriteElement.classList.contains('favorite')) {
                                    favoriteElement.className = "users-favorites";
                                    favoriteElement.src = "img/star.svg";
                                } else {
                                    favoriteElement.className = "favorite";
                                    favoriteElement.src = "img/favorite.svg";
                                }
                            });
                            movieCardElement.appendChild(favoriteElement);

                            // Create all movie info
                            let movieInfo = document.createElement('div');
                            movieInfo.className = 'movie-info';
                            movieCardElement.appendChild(movieInfo);
                            let title = document.createElement('h1');
                            title.className = 'title';
                            title.innerHTML = singleMovie.title;

                            movieInfo.appendChild(title);

                            let movieReleasedElement = document.createElement('h2');
                            movieReleasedElement.innerHTML = '<b>Released: </b>' + singleMovie.release_date;
                            movieInfo.appendChild(movieReleasedElement);

                            let movieRating = document.createElement('h2');
                            movieRating.innerHTML = '<b>Users Rating: </b>' + singleMovie.vote_average;
                            movieInfo.appendChild(movieRating);

                            let movieStoryline = document.createElement('h2');
                            movieStoryline.style.height = '288px';
                            movieStoryline.innerHTML = '<b>Overview: </b>' + singleMovie.storyline;
                            movieInfo.appendChild(movieStoryline);

                            // Request to TMDB api for youtube trailer
                            movieTrailerRequest(singleMovie.id, imageElement);

                        });
                    }
                });
            } else {
                  alert('Error: ' + xhr.status);
            }
        }
    }

    xhr.open("GET", movieUrl, true);
    xhr.send();
}

// Toggle favorite to display all movies or only favorite ones
let toggleFavorite = document.querySelector('.toggleFavoriteAll');
toggleFavorite.addEventListener('click', function() {
    if (toggleFavorite.classList.contains('toggleFavoriteAll')) {
        toggleFavorite.className = "toggleFavoriteOnly";
        toggleFavorite.src = "img/success.svg";
        let allMovieCards = document.querySelectorAll('.movie-card');

        let displayFavorites = document.querySelectorAll('.favorite');
        displayFavorites.forEach(function(favorite) {
            favorite.parentElement.style.display = 'none';
        });

    } else {
        let displayFavorites = document.querySelectorAll('.favorite');
        displayFavorites.forEach(function(favorite) {
            favorite.parentElement.style.display = 'flex';
        });
        toggleFavorite.className = "toggleFavoriteAll";
        toggleFavorite.src = "img/error.svg";
    }
});

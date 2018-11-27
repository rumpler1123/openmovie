// Define variable and XMLHttpRequest 
var counter = 1;
const xhr = new XMLHttpRequest();
var lastPageNumber = 0;

// XHR 
function openXhr(movieTitle){

  xhr.open('get',`http://www.omdbapi.com/?s=${movieTitle}&page=${counter}&apikey=e7c4a3c3`);

  xhr.onload = function(){
    if(this.status === 200){
      const response = JSON.parse(this.responseText);
      // Check movie title 
      if(response.Error == 'Movie not found!'){
        // Show alert
        showAlert('Movie not found!');
      }else{
        // Max Page Number 
        lastPageNumber = Math.ceil(response.totalResults/10);
  
        let output = "";
        // Output HTML code 
        response.Search.forEach(function(repo){
          output +=`
          <div class="col-md-3">
            <div class="well text-center boxShadow">
              <img src="${repo.Poster}"> 
              <h6>${repo.Title}</h6>
              <a id="detailsBtn" onclick="movieSelected('${repo.imdbID}')" href="#">Details >> </a>
            </div>
          </div>
          `;
        })

        document.getElementById('page').style.display = 'flex';
        document.querySelector('#movies').innerHTML = output;
        document.getElementById('pageSpan').innerHTML = `${counter} / ${lastPageNumber}`;
        
        // Pagination visibility

        if(counter == 1){
          document.getElementById('first').style.visibility = 'hidden';
          document.getElementById('prev').style.visibility = 'hidden';
        }else{
          document.getElementById('first').style.visibility = 'visible';
          document.getElementById('prev').style.visibility = 'visible';
        }

        if(counter == lastPageNumber){
          document.getElementById('last').style.visibility = 'hidden';
          document.getElementById('next').style.visibility = 'hidden';
        }else{
          document.getElementById('last').style.visibility = 'visible';
          document.getElementById('next').style.visibility = 'visible';
        }
      }
    }
  }
    xhr.send();
}

  // Search Movie
  document.querySelector('.btn-info').addEventListener('click', function (e){
  
  var movieTitle = document.getElementById('movie-title').value;
  // Check input field 
  if(movieTitle == '' || movieTitle.length < 3 ){
    showAlert('Please fill in the field  min 3 characters');
  }else{
    // Clear Alert
    clearAlert();
    counter = 1;
    //session storage 
    movieSelect(movieTitle);
    // XHR open 
    openXhr(movieTitle);
  }
  e.preventDefault();
})


//                  ---- Pagination ----

// Next Page 
document.getElementById('next').addEventListener('click', nextPage);
function nextPage(){
  // Get item from session storage 
  const movieTitle = sessionStorage.getItem('MovieTitle');
  counter++;
  openXhr(movieTitle);
}

// Prev Page
document.getElementById('prev').addEventListener('click', prevPage);
function prevPage(){
  // Get item from session storage 
  const movieTitle = sessionStorage.getItem('MovieTitle');
  counter--;
  openXhr(movieTitle);
}

// First Page 
document.getElementById('first').addEventListener('click', firstPage);
function firstPage(){
  const movieTitle = sessionStorage.getItem('MovieTitle');
  counter = 1;
  openXhr(movieTitle);
}

// Last Page 
document.getElementById('last').addEventListener('click', lastPage);
function lastPage(){
  const movieTitle = sessionStorage.getItem('MovieTitle');
  counter = lastPageNumber;
  openXhr(movieTitle);
}

// Movie title move to session storage
function movieSelect(title){
  sessionStorage.setItem('MovieTitle', title);
}

// IMDB ID move to Session Storage 
function movieSelected(id){
  sessionStorage.setItem('movieID', id);
  window.open('movie.html','_blank');
  return false;
}

//  Show alert message 
function showAlert(msg){
  clearAlert();
  // Create div and add class name
  const div = document.createElement('div');
  div.className = `alert alert-danger`;
  // Add text 
  div.appendChild(document.createTextNode(msg));
  // Get parent  
  const jumbotron = document.querySelector('.jumbotron');
  const form = document.querySelector('#movie-form');
  // Insert alert 
  jumbotron.insertBefore(div, form);
}

// Clear alert 
function clearAlert(){
  const currentAlert = document.querySelector('.alert');
    if(currentAlert){
      document.querySelector('.alert').remove();
    }
}

 // Movie info HTML

 function getMovie(){
  let movieId = sessionStorage.getItem('movieID');

  xhr.open('GET' ,`http://www.omdbapi.com/?i=${movieId}&plot=full&apikey=e7c4a3c3`, true);

  xhr.onload = function(){
    if(this.status === 200){
      const response = JSON.parse(this.responseText);
      
      // HTML output code 

      output = `
      <div class="row">
        <div class="col-md-4">
        <img src="${response.Poster}">
        </div>
        <div class="col-md-8">
          <h1>${response.Title}</h1>
          <p><strong>Genre: </strong>${response.Genre}</p>
          <p><strong>Year: </strong>${response.Year}</p>
          <p><strong>Writer: </strong>${response.Writer}</p>
          <p><strong>Director: </strong>${response.Director}</p>
          <p><strong>Actors: </strong>${response.Actors}</p>
          <p><strong>Runtime: </strong>${response.Runtime}</p>
          <p><strong>Released: </strong>${response.Released}</p>
          <p><strong>IMDB Rating: </strong>${response.imdbRating}</p>
        </div>
      </div> 
      <div class="row">
        <div class="well">
          <h3>Plot: </h3>
          ${response.Plot}
          <hr>
          <a href="http://imdb.com/title/${response.imdbID}" target="_blank" class="btn btn-warning">Go to IMDB</a>
          <a href="index.html" class="btn btn-primary">Go back to search</a>
        </div>
      </div> 
      `
      document.querySelector('.well').innerHTML = output;
    }
  }
  xhr.send();
}
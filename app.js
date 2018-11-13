  document.addEventListener('submit', function (e){
    var movieTitle = document.getElementById('movie-title').value;
    console.log(movieTitle);

    const xhr = new XMLHttpRequest();

    xhr.open('GET' ,`http://www.omdbapi.com/?s=${movieTitle}&apikey=e7c4a3c3`, true);
    console.log(xhr);
    xhr.onload = function(){
      if(this.status === 200){
        const response = JSON.parse(this.responseText);
        let output = "";
        console.log(response);

        response.Search.forEach(function(repo) {
          output += `
          <div class="col-md-3">
            <div class="well text-center boxShadow">
              <img src="${repo.Poster}"> 
              <h6>${repo.Title}</h6>
              <a id="detailsBtn" onclick="movieSelected('${repo.imdbID}')" href="#">Details >> </a>
            </div>
          </div>
      `;
        })
        document.querySelector('#movies').innerHTML = output;
      }
    }

    xhr.send();
    e.preventDefault();
    
  })
  
  function movieSelected(id){
    sessionStorage.setItem('movieID', id);
    window.location = 'movie.html';
    return false;
  }

  function getMovie(){
    let movieId = sessionStorage.getItem('movieID');
    const xhr = new XMLHttpRequest();
    xhr.open('GET' ,`http://www.omdbapi.com/?i=${movieId}&apikey=e7c4a3c3`, true);
    console.log(xhr);
    xhr.onload = function(){
      if(this.status === 200){
        const response = JSON.parse(this.responseText);
        console.log(response);
        
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
            <a href="http://imdb.com/title/${response.imdbID}" target="_blank" class="btn btn-warning">Go IMDB</a>
            <a href="index.html" class="btn btn-primary">Go Back to Search</a>
          </div>
        </div> 
        `
        document.querySelector('.well').innerHTML = output;
      }
    }

    xhr.send();
  }
 


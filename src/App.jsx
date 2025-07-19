import { useEffect, useState } from "react";
import './App.css'
import StarRating from "./StarRating";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies,setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading]=useState(false);
  const [error,setError]=useState('')
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedID] =useState(null)
// console.log(movies);

  function handleAddWatchedMovies(movie){
   setWatched(watched=>[...watched, movie])
   setSelectedID(null);
   console.log(movie.ID)
   console.log(selectedID);
  }

  function handleDeleteWatchedMovie(ID){
   setWatched(watched=>watched.filter(movie=>movie.ID!==ID))
  }

//  console.log(watched);/
  useEffect(function(){
    
    async function getMovies() {
      try{
        setError('');
        setIsLoading(true);
        const res = await fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=dc5eb85`);
        if (!res.ok) {
          throw new Error("😭 Something Went Wrong");
        }

        const data= await res.json();
        // console.log(data);
        if (data.Response==="False") {

          throw new Error("❌ Movie Not Found.");
        }

        setMovies(data.Search)
        
     }
     catch (err) {
       
        console.log(err.message); // Log the message specifically
        setError(err.message);
}
     finally{
      setIsLoading(false);
     }
    }
    
    //Call api only when there are 4 letters in the search bar and reset movies and error state if any
    if(query.length<3){
      setMovies([]);
      setError('')
      return;
    }
    getMovies();
    
  },[query])

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading?<Loader/>:<MovieList movies={movies} />} */}
           {isLoading&&<Loader/>}
          {!isLoading && !error&& <MovieList onMovieSelect={setSelectedID}  movies={movies}/>}
          {error&& <ErrorMessage message={error}/>} 
        </Box>
         <box>

        {selectedID?
        
               <SelectedMovie 
               onAddWatchedMovie={handleAddWatchedMovies} 
               onCloseBtn={setSelectedID} 
               ID={selectedID}
               watched={watched}
               />
               :
                <>
                  <WatchedSummary watched={watched} />
                  <WatchedMoviesList onDeleteWatchedMovie={handleDeleteWatchedMovie} watched={watched} />
                </>}
         </box>
        
      </Main>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function ErrorMessage({message}){
  return(<p className="error">{message}</p>)
}
function Loader(){
  return(
    <p className="loader">Loading...</p>
  )
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({query,setQuery}) {
  

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

/*
function WatchedBox() {
  const [watched, setWatched] = useState(tempWatchedData);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>

      {isOpen2 && (
        <>
          <WatchedSummary watched={watched} />
          <WatchedMoviesList watched={watched} />
        </>
      )}
    </div>
  );
}
*/

function MovieList({ movies,onMovieSelect }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onMovieSelect={onMovieSelect} />
      ))}
    </ul>
  );
}

function Movie({ movie,onMovieSelect }) {
  
  return (
    <li onClick={()=>onMovieSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched,onDeleteWatchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} onDeleteWatchedMovie={onDeleteWatchedMovie}/>
      ))}
    </ul>
  );
}

function WatchedMovie({ movie,onDeleteWatchedMovie }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button onClick={()=>onDeleteWatchedMovie(movie.ID)} className="btn-delete ">X</button>
      </div>
    </li>
  );
}

function SelectedMovie({ID,onCloseBtn,onAddWatchedMovie,watched}){
  const [selectedMovie, setSelectedMovie]=useState({});
  const [isLoading, setIsLoading]=useState(false);
  const [userRating,setUserRating]=useState(0);
  const isWatched=watched.map((movie)=>movie.ID).includes(ID);
  const watchedUserRating= watched.find(movie=>movie.ID===ID)?.userRating;
  console.log(watchedUserRating)


   console.log(isWatched);
   
  useEffect(function(){
    async function getSelectedMovie() {
       setIsLoading(true)
      const res = await fetch(`http://www.omdbapi.com/?i=${encodeURIComponent(ID)}&apikey=dc5eb85`);
      const data= await res.json();
      setSelectedMovie(data);
      setIsLoading(false)
    }
    getSelectedMovie();
  },[ID])
   const {
    Title:title,
    Poster:poster,
    Released:released,
    Runtime:runtime,
    Plot:plot,
    Actors:actors,
    // Rated:rated,
    Genre:genre,

    Director:director
  } =selectedMovie;
  function handleOnclick(){
    const newWatchedMovie={
      ID:ID,
      poster:poster,
      title:title,
      runtime:Number(runtime.split(" ").at(0)),
      userRating:userRating,
    }
     console.log(newWatchedMovie)
   
    onAddWatchedMovie(newWatchedMovie);
  }
  return(
    <div className="details">

      {isLoading?(<Loader/>):
       (<>
         <header>
           <button onClick={()=>onCloseBtn(null)} className="btn-back">&larr;</button>
           <img src={poster} alt={`Poster of ${title}`} />
           <div className="details-overview">
             <h2>{title}</h2>
             <p>
               {released} &bull; {runtime}
             </p> 
             <p>{genre}</p>
             {/* <p> <span>⭐</span>{ratings[0]?.Value} <span>IMDB Ratings</span></p> */}
           </div>
         </header>
         <section>
            <div className="rating">
             {!isWatched?
             <>
                <StarRating  
                maxRating={10} 
                size={24} 
                onSetRating={rating=>setUserRating(Number(rating))}
                />
                {userRating>0&&
                (
                  <button 
                className="btn-add"
                  onClick={handleOnclick}>
                    Add to list
                  </button>)}
              </>:
              <p>{`You rated this movie ⭐${watchedUserRating}/10 `}</p>}
            </div>
            <p>
             <em>{plot}</em>
            </p>
            <p><span>Starring </span>{actors}</p>
            <p><span>Directed by </span>{director}</p>
         </section>
         
       </>)}
    </div>
    
  )
}

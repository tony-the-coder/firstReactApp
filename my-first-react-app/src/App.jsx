import React, {useEffect, useState} from 'react'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce, useRafState} from "react-use";
import {getTrendingMovies, updateSearchCount} from './appwrite.js'
const API_BASE_URL = "https://api.themoviedb.org/3/";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS =
    {
        method: "GET",
        headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
        }
    }

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    //To set how fast an API query should be called
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
    const [trendingMovies, setTrendingMovies] = useState([]);


       useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm])

//To search for something via an API (in this case we are searching for movies with TMDB) create an empty query string
//then pass the searchTerm to useEffect
    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');
        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            // Parsing the response into an object

            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();
            //Testing the API connection
            // console.log(data);

            if (data.Response === 'False') {
                setErrorMessage(data.Error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);
            if(query && data.results.length > 0){
                await updateSearchCount(query, data.results[0]);
            }
        }catch (e) {
            console.error(`Error fetching movies: ${e}`);
            setErrorMessage("Error fetching movies")
        }
        finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () =>
    {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies);
        }

        catch
            (e)
            {
                console.error(`Error fetching movies: ${e}`);

            }
        }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
        //Then add the searchTerm query to the deps to re-call the query as one types
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, []);

    return (
       <main>
           <div className="pattern" />
           <div className="wrapper">
               <header>
                   <img src="../public/hero.png" alt="Hero Banner" />
               <h1>Find<span className="text-gradient"> Movies </span>You'll Enjoy Without the Hassle</h1>
                   {/* Imports the search component from the component folder. */}
                   <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
               </header>

               { trendingMovies.length > 0 && (
                   <section className = "trending">
                       <h2>Trending Movies</h2>
            <ul>
                { trendingMovies.map((movie, index) =>
                    (
                        <li key ={movie.$id}>
                           <p>{ index + 1 }</p>
                            <img src={movie.poster_url} alt={movie.title} />
                        </li>
                    ))
                }
            </ul>
                   </section>
               )}


        <section className="all-movies">
        <h2>All Movies</h2>

            {isLoading ? (
                <Spinner />
            ) : errorMessage ? () => (
                <p className="text-red-500">{errorMessage}</p>
            ) : (<ul>
                {movieList.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                    ))}
            </ul>
                )}
        </section>

           </div>

       </main>
    )
}
export default App

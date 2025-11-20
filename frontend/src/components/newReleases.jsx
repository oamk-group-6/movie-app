import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import "./newReleases.css"

const API_URL = process.env.REACT_APP_API_URL

export default function NewReleases() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    //Haetaan 5 elokuvaa backendistä
    fetch(`${API_URL}/movies?limit=30`)
      .then(res => res.json())
      .then(data => {
        //Järjestetään suurimmasta release_year pienimpään
        const sorted = data.sort((a, b) => b.release_year - a.release_year)
        setMovies(sorted);
      })
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <div className="new-releases-container">
        {movies.map(movie => (
          <Link
            to={`/movies/${movie.id}`}
            key={movie.id}
            className="movie-card"
          >
            <img src={movie.poster_url} alt={movie.title} />
            <h4>{movie.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  )
}

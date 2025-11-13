import { useEffect, useState } from "react"
import "./hotNow.css"

const API_URL = process.env.REACT_APP_API_URL

export default function HotNow() {
  const [movies, setMovies] = useState([])

  //**** ETSII TÄLLÄ HETKELLÄ SAMAT ELOKUVAT KUIN "NEW RELEASES" ****
  useEffect(() => {
    //Haetaan 5 elokuvaa backendistä
    fetch(`${API_URL}/movies?limit=5`)
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
      <div className="new-releases-wrapper">
        <div className="hot-now-container">
          {movies.map(movie => (
            <div key={movie.external_id} className="hot-movie-card">
              <img src={movie.poster_url} alt={movie.title} />
              <h4>{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

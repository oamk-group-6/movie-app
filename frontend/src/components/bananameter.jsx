import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function BananaMeter({ movieId }) {
    //const { id } = useParams();
    const [ratingAvg, setRatingAvg] = useState(0);

    useEffect(() => {
        fetch(`${API_URL}/ratings/avg/${movieId}`)
            .then(res => res.json())
            .then(data => {
                setRatingAvg(data.average)
            })
            .catch(err => console.error(err));
    }, [movieId])

    return (
        <div className="movie-average-bar">
            <div
                className="movie-average-fill"
                style={{ width: `${ratingAvg}%` }}
            />
            <span className="movie-average-number">
                Bananameter: {Math.round(ratingAvg)}%
            </span>
        </div>
    );
}
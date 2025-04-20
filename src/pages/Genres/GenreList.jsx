import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getGenres } from "../../api/api";
import "../../styles/GenreList.css";

function GenreList() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getGenres();
        let genresData;
        if (Array.isArray(response)) {
          genresData = response;
        } else if (response && typeof response === "object") {
          if (response.genres && Array.isArray(response.genres)) {
            genresData = response.genres;
          } else {
            genresData = Object.values(response).filter(
              (item) => item && typeof item === "object" && item.name
            );
          }
        }
        setGenres(genresData || []);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (error)
    return (
      <div className="genre-list-container">
        <h1>Erreur</h1>
        <div>Une erreur s'est produite: {error}</div>
      </div>
    );

  if (loading)
    return (
      <div className="genre-list-container">
        <h1>Chargement des genres...</h1>
      </div>
    );

  if (!genres || genres.length === 0)
    return (
      <div className="genre-list-container">
        <h1>Aucun genre disponible</h1>
        <p>Veuillez vérifier que l'API retourne des données.</p>
      </div>
    );

  return (
    <div className="genre-list-container">
      <h1>Liste des Genres</h1>
      <div className="genre-grid">
        {genres.map((genre, index) => (
          <Link
            key={genre.id || `genre-${index}`}
            to={`/genres/${genre.id || genre.name}`}
          >
            <div className="genre-card" data-genre={genre.name}>
              <div className="genre-card-inner">
                <h3>{genre.name}</h3>
                {genre.album_count && <p>{genre.album_count} albums</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default GenreList;

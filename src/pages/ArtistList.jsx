import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArtists } from "../api/api";
import "../styles/ArtistList.css";

function ArtistList() {
  const [artists, setArtists] = useState([]);
  const [page, setPage] = useState(1);
  const totalPages = 100;
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const limit = 10;

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const response = await getArtists(page, limit);

        const artistsData = Array.isArray(response) ? response : response.artists || [];

        setArtists(artistsData);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [page]);

  if (error) return <div className="artist-error">Erreur: {error}</div>;
  if (loading && page === 1) return <div className="artist-loading">Chargement...</div>;
  if (!artists.length) return <div className="artist-empty">Aucun artiste trouvé sur cette page</div>;

  return (
    <div className="artist-list-container">
      <h1>Liste des Artistes</h1>
      <div className="artist-list">
        {artists.map((artist) => (
          <Link key={artist.id} to={`/artists/${artist.id}`}>
            <div className="artist-card">
              <img
                src={artist.photo || "/api/placeholder/150/150"}
                alt={artist.name}
              />
              <h3>{artist.name}</h3>
              {artist.nb_albums && <p>{artist.nb_albums} albums</p>}
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Précédent
        </button>
        <span>
          Page {page} sur {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}>
          Suivant
        </button>
      </div>
    </div>
  );
}

export default ArtistList;
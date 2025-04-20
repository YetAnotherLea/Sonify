import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAlbums, getArtistById } from "../api/api";
import "../styles/Accueil.css";

function Accueil() {
  const [randomAlbums, setRandomAlbums] = useState([]);
  const [artists, setArtists] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRandomAlbums = async () => {
      try {
        setLoading(true);
        const data = await getAlbums(1, 50);
        const albumsData = Array.isArray(data) ? data : data.albums || [];
        
        if (albumsData.length === 0) {
          setError("Aucun album disponible");
          setLoading(false);
          return;
        }

        const shuffled = [...albumsData].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 5);
        
        setRandomAlbums(selected);
        await fetchArtists(selected);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchArtists = async (albumsData) => {
      const uniqueArtistIds = [...new Set(albumsData.map((a) => a.artist_id))];
      const artistPromises = uniqueArtistIds.map((id) => fetchArtistData(id));
      const artistData = await Promise.all(artistPromises);

      const artistMap = artistData.reduce((acc, { id, name }) => {
        acc[id] = name;
        return acc;
      }, {});
      setArtists(artistMap);
    };

    const fetchArtistData = async (id) => {
      try {
        const res = await getArtistById(id);
        return { id, name: res.name || "Artiste inconnu" };
      } catch {
        return { id, name: "Artiste inconnu" };
      }
    };

    fetchRandomAlbums();
  }, []);

  if (error) return <div className="error-message">Erreur : {error}</div>;
  if (loading) return <div className="loading">Chargement...</div>;
  if (randomAlbums.length === 0) return <div>Aucun album disponible</div>;

  return (
    <div className="accueil-container">
      <section className="welcome-section">
        <h1>Bienvenue sur notre bibliothèque musicale</h1>
        <p>Découvrez notre sélection d'albums du moment</p>
      </section>
      
      <section className="featured-albums">
        <h2>Albums à découvrir</h2>
        <div className="random-album-grid">
          {randomAlbums.map((album) => (
            <Link key={album.id} to={`/albums/${album.id}`} className="album-link">
              <div className="featured-album-card">
                <div className="album-cover">
                  <img
                    src={album.cover_small || "/default.png"}
                    alt={album.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.png";
                    }}
                  />
                </div>
                <div className="album-info">
                  <h3>{album.name}</h3>
                  <p>{artists[album.artist_id] || "Artiste inconnu"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      
      <section className="more-albums">
        <Link to="/albums" className="view-all-button">
          Voir tous les albums
        </Link>
      </section>
    </div>
  );
}

export default Accueil;
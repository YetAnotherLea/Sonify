import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAlbums, getArtistById } from "../api/api";
import "../styles/AlbumList.css";

function AlbumList() {
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(100);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getAlbums(page, limit);
        const albumsData = Array.isArray(data) ? data : data.albums || [];

        if (albumsData.length === 0 && page <= totalPages) {
          setTotalPages(page - 1);
        }

        setAlbums(albumsData);
        await fetchArtists(albumsData);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
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

    fetchAlbums();
  }, [page]);

  if (error) return <div>Erreur: {error}</div>;
  if (!albums.length && page === 1) return <div>Chargement...</div>;
  if (!albums.length) return <div>Aucun album sur cette page</div>;

  return (
    <div className="album-list-container">
      <h1>Liste des albums</h1>
      <div className="album-list">
        {albums.map((album) => (
          <Link key={album.id} to={`/albums/${album.id}`}>
            <div className="album-card">
              <img
                src={
                  album.cover_small ||
                  "https://i.scdn.co/image/ab67616d0000b273d6e244e6e85f9f3e2f54e0f8"
                }
                alt={album.name}
              />
              <h3>{album.name}</h3>
              <p>{artists[album.artist_id] || "Artiste inconnu"}</p>
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

export default AlbumList;

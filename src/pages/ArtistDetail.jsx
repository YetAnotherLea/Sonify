import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getArtistById, getAlbumsByArtist } from "../api/api";
import "../styles/ArtistDetail.css";

function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        setLoading(true);

        const artistData = await getArtistById(id);
        setArtist(artistData);

        const albumsData = await getAlbumsByArtist(id);
        const albumsList = Array.isArray(albumsData)
          ? albumsData
          : albumsData.albums || [];
        setAlbums(albumsList);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistDetails();
  }, [id]);

  if (error) return <div className="artist-error">Erreur: {error}</div>;
  if (loading) return <div className="artist-loading">Chargement...</div>;
  if (!artist)
    return <div className="artist-not-found">Artiste non trouvé</div>;

  return (
    <div className="artist-detail-container">
      <div className="artist-header">
        <img
          src={artist.photo || "/api/placeholder/300/300"}
          alt={artist.name}
          className="artist-image"
        />
        <div className="artist-info">
          <h1>{artist.name}</h1>
          {artist.nb_albums && <p>{artist.nb_albums} albums</p>}
          {artist.bio && <p className="artist-bio">{artist.bio}</p>}
        </div>
      </div>

      <h2>Albums</h2>
      {albums.length === 0 ? (
        <p>Aucun album trouvé pour cet artiste</p>
      ) : (
        <div className="album-list">
          {albums.map((album) => (
            <Link key={album.id} to={`/albums/${album.id}`}>
              <div className="album-card">
                <img
                  src={album.cover_small || "/api/placeholder/150/150"}
                  alt={album.name}
                />
                <h3>{album.name}</h3>
                {album.release_date && (
                  <p>{new Date(album.release_date).getFullYear()}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtistDetail;

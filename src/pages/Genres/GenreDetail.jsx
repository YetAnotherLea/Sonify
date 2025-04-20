import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getGenreById, getAlbumById, getArtistById } from "../../api/api";
import "../../styles/GenreDetail.css";

function GenreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [genreData, setGenreData] = useState(null);
  const [albumIds, setAlbumIds] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const response = await getGenreById(id);

        if (response && response.genre) {
          setGenreData(response.genre);
          setAlbumIds(response.albums || []);
        } else if (response && response.id) {
          setGenreData(response);
          setAlbumIds(response.albums || []);
        } else {
          throw new Error("Format de réponse non reconnu");
        }

        const albumCount = response.albums ? response.albums.length : 0;
        setTotalPages(Math.max(1, Math.ceil(albumCount / limit)));
      } catch (err) {
        setError("Impossible de charger les informations du genre");
      }
    };

    fetchGenreData();
  }, [id]);

  useEffect(() => {
    const fetchAlbumsForPage = async () => {
      if (!albumIds || albumIds.length === 0) {
        setAlbums([]);
        setLoading(false);
        return;
      }

      try {
        const startIndex = (page - 1) * limit;
        const endIndex = Math.min(startIndex + limit, albumIds.length);
        const albumIdsForCurrentPage = albumIds.slice(startIndex, endIndex);
        const albumPromises = albumIdsForCurrentPage.map((albumId) =>
          getAlbumById(albumId)
        );
        const albumsData = await Promise.all(albumPromises);
        const validAlbums = albumsData
          .filter((data) => data && data.album && data.album.id)
          .map((data) => data.album);
        setAlbums(validAlbums);
        await fetchArtists(validAlbums);
      } catch (err) {
        setError("Impossible de charger les albums");
      } finally {
        setLoading(false);
      }
    };

    if (albumIds.length > 0) {
      fetchAlbumsForPage();
    }
  }, [albumIds, page]);

  const fetchArtists = async (albumsData) => {
    const uniqueArtistIds = [
      ...new Set(albumsData.map((album) => album.artist_id).filter((id) => id)),
    ];
    const artistPromises = uniqueArtistIds.map((artistId) =>
      fetchArtistData(artistId)
    );
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
    } catch (err) {
      return { id, name: "Artiste inconnu" };
    }
  };

  if (error)
    return (
      <div className="genre-details-container">
        <h1>Erreur</h1>
        <div>Une erreur est survenue : {error}</div>
        <button onClick={() => navigate("/genres")} className="back-button">
          Retour aux genres
        </button>
      </div>
    );

  if (loading)
    return (
      <div className="genre-details-container">
        <h1>Chargement...</h1>
      </div>
    );

  return (
    <div className="genre-details-container">
      <h1>{genreData.name}</h1>

      {albums.length === 0 ? (
        <div className="no-albums">
          <p>Aucun album trouvé pour ce genre.</p>
        </div>
      ) : (
        <>
          <div className="album-list">
            {albums.map((album) => (
              <Link key={album.id} to={`/albums/${album.id}`}>
                <div className="album-card">
                  <img
                    src={album.cover_small || "/default.png"}
                    alt={album.name || "Album inconnu"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/default.png";
                    }}
                  />
                  <h3>{album.name || "Album inconnu"}</h3>
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
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      <button onClick={() => navigate("/genres")} className="back-button">
        Retour aux genres
      </button>
    </div>
  );
}

export default GenreDetail;
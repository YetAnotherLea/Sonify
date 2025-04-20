import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAlbums, getGenres, getArtists, getArtistById } from "../api/api";
import "../styles/Search.css";

function Search() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("albums");
  const [results, setResults] = useState([]);
  const [artists, setArtists] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10;

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        let data = [];
        let total = 0;

        if (searchType === "albums") {
          const response = await getAlbums(1, 100);
          const filtered = response.filter((album) =>
            album.name.toLowerCase().includes(query.toLowerCase())
          );
          total = filtered.length;
          data = filtered.slice((page - 1) * limit, page * limit);
          await fetchArtists(data);
        } else if (searchType === "genres") {
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
          const filtered = (genresData || []).filter((genre) =>
            genre.name.toLowerCase().includes(query.toLowerCase())
          );
          total = filtered.length;
          data = filtered.slice((page - 1) * limit, page * limit);
        } else if (searchType === "artists") {
          try {
            const response = await getArtists(1, 100);
            const filtered = response.filter((artist) =>
              artist.name.toLowerCase().includes(query.toLowerCase())
            );
            total = filtered.length;
            data = filtered.slice((page - 1) * limit, page * limit);
          } catch (err) {
            console.warn("Le endpoint /artists ne fonctionne pas:", err);
            setError("Recherche des artistes indisponible pour le moment");
            setResults([]);
            setTotalPages(1);
            setLoading(false);
            return;
          }
        }

        setResults(data);
        setTotalPages(Math.max(1, Math.ceil(total / limit)));
      } catch (err) {
        console.error("Erreur lors de la recherche:", err);
        setError("Impossible de réaliser la recherche");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, searchType, page]);

  const fetchArtists = async (albums) => {
    const uniqueArtistIds = [
      ...new Set(albums.map((album) => album.artist_id).filter((id) => id)),
    ];
    const artistPromises = uniqueArtistIds.map(async (id) => {
      try {
        const res = await getArtistById(id);
        return { id, name: res.name || "Artiste inconnu" };
      } catch {
        return { id, name: "Artiste inconnu" };
      }
    });
    const artistData = await Promise.all(artistPromises);
    const artistMap = artistData.reduce((acc, { id, name }) => {
      acc[id] = name;
      return acc;
    }, {});
    setArtists(artistMap);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPage(1);
  };

  if (error)
    return (
      <div className="search-container">
        <h1>Erreur</h1>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="search-container">
      <h1>Recherche</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher des albums, des genres ou des artistes..."
        />
        <div className="search-tabs">
          <button
            className={searchType === "albums" ? "active" : ""}
            onClick={() => {
              setSearchType("albums");
              setPage(1);
            }}
          >
            Albums
          </button>
          <button
            className={searchType === "genres" ? "active" : ""}
            onClick={() => {
              setSearchType("genres");
              setPage(1);
            }}
          >
            Genres
          </button>
          <button
            className={searchType === "artists" ? "active" : ""}
            onClick={() => {
              setSearchType("artists");
              setPage(1);
            }}
          >
            Artistes
          </button>
        </div>
      </div>

      {loading && <p>Chargement...</p>}
      {!loading && query && results.length === 0 && (
        <p>
          Aucun résultat pour la recherche de «{query}» dans {searchType}.
        </p>
      )}
      {!loading && results.length > 0 && (
        <>
          {searchType === "genres" ? (
            <div className="genre-grid">
              {results.map((genre, index) => (
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
          ) : searchType === "artists" ? (
            <div className="artist-list">
              {results.map((artist) => (
                <Link key={artist.id} to={`/artists/${artist.id}`}>
                  <div className="artist-card">
                    <img
                      src={artist.photo || "/default.png"}
                      alt={artist.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default.png";
                      }}
                    />
                    <h3>{artist.name}</h3>
                    {artist.nb_albums && <p>{artist.nb_albums} albums</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="results-grid">
              {results.map((item) => (
                <Link key={item.id} to={`/albums/${item.id}`}>
                  <div className="result-card">
                    <img
                      src={item.cover_small || "/default.png"}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/default.png";
                      }}
                    />
                    <h3>{item.name}</h3>
                    <p>{artists[item.artist_id] || "Artiste inconnu"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
    </div>
  );
}

export default Search;

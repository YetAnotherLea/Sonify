import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { getAlbumById, getArtistById } from "../api/api";
import "../styles/AlbumDetail.css";

function AlbumDetail() {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [artist, setArtist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAlbumDetails = async () => {
      try {
        setLoading(true);

        // Preia albumul și pistele
        const albumData = await getAlbumById(id);
        setAlbum(albumData.album);
        setTracks(albumData.tracks || []);

        // Preia artistul
        const artistData = await getArtistById(albumData.album.artist_id);
        setArtist(artistData);
      } catch (err) {
        console.error("Erreur API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetails();
  }, [id]);

  const handlePlayTrack = (track) => {
    if (currentTrack?.id === track.id && !audioRef.current.paused) {
      audioRef.current.pause();
      setCurrentTrack(null);
    } else {
      setCurrentTrack(track);
      audioRef.current.src = track.mp3; // Modificat din track.audio în track.mp3
      audioRef.current
        .play()
        .catch((err) => console.error("Erreur lecture:", err));
    }
  };

  const handleAudioEnded = () => {
    setCurrentTrack(null);
  };

  if (error) return <div className="album-error">Erreur: {error}</div>;
  if (loading) return <div className="album-loading">Chargement...</div>;
  if (!album) return <div className="album-not-found">Album non trouvé</div>;

  return (
    <div className="album-detail-container">
      <div className="album-header">
        <img
          src={album.cover_small || "/default.png"}
          alt={album.name}
          className="album-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default.png";
          }}
        />
        <div className="album-info">
          <h1>{album.name}</h1>
          {artist && (
            <p>
              <Link to={`/artists/${artist.id}`} className="artist-link">
                {artist.name}
              </Link>
            </p>
          )}
          {album.release_date && (
            <p>{new Date(album.release_date).getFullYear()}</p>
          )}
          <p>{tracks.length} titres</p>
        </div>
      </div>

      <h2>Pistes</h2>
      {tracks.length === 0 ? (
        <p>Aucun titre trouvé pour cet album</p>
      ) : (
        <div className="track-list">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`track-item ${
                currentTrack?.id === track.id && !audioRef.current?.paused
                  ? "playing"
                  : ""
              }`}
              onClick={() => handlePlayTrack(track)}
            >
              <span className="track-number">{index + 1}</span>
              <span className="track-name">{track.name}</span>
              <span className="track-duration">
                {track.duration
                  ? `${Math.floor(track.duration / 60)}:${(track.duration % 60)
                      .toString()
                      .padStart(2, "0")}`
                  : "-"}
              </span>
              <span className="play-icon">
                {currentTrack?.id === track.id && !audioRef.current?.paused
                  ? "⏸️"
                  : "▶️"}
              </span>
            </div>
          ))}
        </div>
      )}

      <audio ref={audioRef} onEnded={handleAudioEnded} />
    </div>
  );
}

export default AlbumDetail;

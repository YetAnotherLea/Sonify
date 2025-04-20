import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AlbumList from "./pages/AlbumList";
import TestAPI from "./pages/TestAPI";
import "./App.css";

function Home() {
  return <h1>Page d'accueil</h1>;
}
function AlbumDetail() {
  return <h1>Detailles album</h1>;
}
function GenreList() {
  return <h1>Liste des genres</h1>;
}
function GenreDetail() {
  return <h1>Detailles du genre</h1>;
}
function ArtistList() {
  return <h1>Liste des artistes</h1>;
}
function ArtistDetail() {
  return <h1>Detailles de l'artiste</h1>;
}
function Search() {
  return <h1>Recherche</h1>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/albums/:id" element={<AlbumDetail />} />
            <Route path="/genres" element={<GenreList />} />
            <Route path="/genres/:id" element={<GenreDetail />} />
            <Route path="/artists" element={<ArtistList />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/test-api" element={<TestAPI />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

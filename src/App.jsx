import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AlbumList from "./pages/AlbumList";
import GenreList from "./pages/Genres/GenreList";
import GenreDetail from "./pages/Genres/GenreDetail";
import ArtistList from "./pages/ArtistList";
import Accueil from "./pages/Accueil";
import ArtistDetail from "./pages/ArtistDetail";
import AlbumDetail from "./pages/AlbumDetail";
import Search from "./pages/Search";
import TestAPI from "./pages/TestAPI";
import "./App.css";

function Home() {
  return <h1>Page d'accueil</h1>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Accueil />} />
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

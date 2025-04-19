import './App.css';

function Home() {
 return <h1>Page principale</h1>;
}
function AlbumList() {
 return <h1>Liste des albums</h1>;
}
function AlbumDetail() {
 return <h1>Details des albums</h1>;
}
function GenreList() {
 return <h1>Liste des genres</h1>;
}
function GenreDetail() {
 return <h1>Details des genres</h1>;
}
function ArtistList() {
 return <h1>Liste des artistes</h1>;
}
function ArtistDetail() {
 return <h1>Detail des artistes</h1>;
}
function Search() {
 return <h1>Recherche</h1>;
}

function App() {
 return (
  <Router>
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/albums" element={<AlbumList />} />
        <Route path="/albums/:id" element={<AlbumDetail />} />
        <Route path="/genres" element={<GenreList />} />
        <Route path="/genres/:id" element={<GenreDetail />} />
        <Route path="/artists" element={<ArtistList />} />
        <Route path="/artists/:id" element={<ArtistDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </div>
</Router>
 );
}

export default App;


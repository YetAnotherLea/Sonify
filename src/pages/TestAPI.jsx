import { useState, useEffect } from "react";
import { getAlbums } from "../api/api";

function TestAPI() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAlbums(1, 10);
        console.log("Date API (page 1) :", response);
        setData(response);
      } catch (err) {
        console.error("Erreur API :", err);
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  if (error) return <div>Erreur : {error}</div>;
  if (!data) return <div>Chargement...</div>;

  return (
    <div>
      <h1>Test de l'API</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default TestAPI;

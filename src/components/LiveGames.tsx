import { useEffect, useState } from "react";

interface Game {
  idEvent: string;
  strEvent: string;
  dateEvent: string;
  strTime: string;
  strLeague: string;
}

export default function LiveGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // ID da liga (Brasileirão Série A)
  const LEAGUE_ID = "4351";

  useEffect(() => {
    fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsseason.php?id=${LEAGUE_ID}&s=2026`)
      .then(res => res.json())
      .then(data => {
        setGames(data?.events || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">
        ⚽ Próximos Jogos — Mundo Play TV
      </h1>

      {loading && (
        <p className="text-center text-gray-500">Carregando jogos...</p>
      )}

      {!loading && games.length === 0 && (
        <p className="text-center text-red-500">
          Nenhum jogo encontrado no momento.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {games.map(game => (
          <div
            key={game.idEvent}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-lg font-bold">{game.strEvent}</h2>
            <p className="text-gray-600">{game.strLeague}</p>
            <p className="mt-2">
              📅 {game.dateEvent} — 🕓 {game.strTime || "Horário a definir"}
            </p>

            <a
              href="https://wa.me/SEUNUMERO"
              className="mt-4 inline-block w-full text-center px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Assistir com Mundo Play TV
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

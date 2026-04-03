"use client";

import { useEffect, useState, useCallback } from "react";

type LichessPlayer = {
  user?: { name: string };
  rating?: number;
  aiLevel?: number;
};

type LichessGame = {
  id: string;
  rated: boolean;
  speed: string;
  status: string;
  lastMoveAt?: number;
  moves?: string;
  winner?: "white" | "black";
  opening?: { name: string; eco: string };
  players: {
    white: LichessPlayer;
    black: LichessPlayer;
  };
  createdAt: number;
};

type LichessData = {
  current: LichessGame | null;
  recent: LichessGame[];
};

const BOT_NAME = "Fe64_Bot";
const POLL_INTERVAL = 5_000;

function playerLabel(p: LichessPlayer): string {
  if (p.user) return p.user.name;
  if (p.aiLevel !== undefined) return `Stockfish lv.${p.aiLevel}`;
  return "Anonymous";
}

function resultLabel(game: LichessGame): string {
  if (game.status === "draw" || game.status === "stalemate") return "½-½";
  const botSide =
    playerLabel(game.players.white) === BOT_NAME ? "white" : "black";
  if (!game.winner) return "—";
  return game.winner === botSide ? "WIN" : "LOSS";
}

function resultColor(label: string): string {
  if (label === "WIN") return "text-emerald-500";
  if (label === "LOSS") return "text-red-500";
  return "text-neutral-500";
}

function timeAgo(ms: number): string {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60_000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "just now";
}

export default function LichessMatches() {
  const [data, setData] = useState<LichessData | null>(null);
  const [error, setError] = useState(false);

  const fetchData = useCallback(() => {
    fetch("/api/lichess")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: LichessData) => {
        setData(d);
        setError(false);
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

  if (error) {
    return (
      <p className="text-xs text-neutral-600 font-mono">
        [ UPLINK FAILURE — LICHESS API UNREACHABLE ]
      </p>
    );
  }

  if (!data) {
    return (
      <p className="text-xs text-neutral-600 font-mono animate-pulse">
        [ ESTABLISHING UPLINK... ]
      </p>
    );
  }

  const { current, recent } = data;
  const moveCount = current?.moves
    ? current.moves.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const embedVersion = current
    ? (current.lastMoveAt ?? `${current.createdAt}-${moveCount}`)
    : "idle";

  return (
    <div className="space-y-10">
      {/* Live game */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              current ? "bg-emerald-500 animate-pulse" : "bg-neutral-700"
            }`}
          />
          <span className="text-xs uppercase tracking-widest text-neutral-500">
            {current ? "Live now" : "Engine offline"}
          </span>
        </div>

        {current ? (
          <div className="space-y-3">
            <p className="text-xs text-neutral-600 font-mono">
              {playerLabel(current.players.white)} vs{" "}
              {playerLabel(current.players.black)} ·{" "}
              {current.speed.toUpperCase()} ·{" "}
              {current.rated ? "RATED" : "CASUAL"}
            </p>
            {/* <iframe
              src={`https://lichess.org/embed/game/${current.id}?theme=auto&bg=dark`}
              className="w-full border border-neutral-800 rounded-sm"
              style={{ height: 397 }}
            /> */}
            <div className="w-full overflow-hidden rounded-sm border border-neutral-800 shadow-2xl bg-[#161512]">
              <iframe
                key={`${current.id}-${embedVersion}`}
                src={`https://lichess.org/embed/game/${current.id}?theme=dark&bg=dark&v=${embedVersion}`}
                className="w-full aspect-4/5 sm:aspect-600/397"
              />
            </div>
          </div>
        ) : (
          <p className="text-xs text-neutral-700 font-mono">
            [ NO ACTIVE GAME — POLLING EVERY 5s ]
          </p>
        )}
      </div>

      {/* Recent games */}
      {recent.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-4">
            Recent games
          </h3>
          <div className="divide-y divide-neutral-900">
            {recent.map((g) => {
              const label = resultLabel(g);
              return (
                <a
                  key={g.id}
                  href={`https://lichess.org/${g.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-3 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className={`text-xs font-mono w-10 shrink-0 ${resultColor(label)}`}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-neutral-500 truncate">
                      {playerLabel(g.players.white)} vs{" "}
                      {playerLabel(g.players.black)}
                    </span>
                    {g.opening && (
                      <span className="text-xs text-neutral-700 truncate hidden sm:block">
                        {g.opening.eco} · {g.opening.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 shrink-0 ml-4">
                    <span className="text-xs text-neutral-700 uppercase">
                      {g.speed}
                    </span>
                    <span className="text-xs text-neutral-700">
                      {timeAgo(g.createdAt)}
                    </span>
                    <span className="text-xs text-neutral-700 group-hover:text-neutral-400 transition-colors">
                      ↗
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
          <a
            href={`https://lichess.org/@/${BOT_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-xs text-neutral-700 hover:text-neutral-400 transition-colors uppercase tracking-widest"
          >
            View all games on Lichess ↗
          </a>
        </div>
      )}
    </div>
  );
}

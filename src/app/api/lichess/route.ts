export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const [currentRes, recentRes] = await Promise.all([
    fetch("https://lichess.org/api/user/Fe64_Bot/current-game", {
      headers: { Accept: "application/json" },
      cache: "no-store",
    }),
    fetch(
      "https://lichess.org/api/games/user/Fe64_Bot?max=8&moves=false&pgnInJson=false&opening=true",
      {
        headers: { Accept: "application/x-ndjson" },
        cache: "no-store",
      },
    ),
  ]);

  const current = currentRes.ok ? await currentRes.json() : null;

  // NDJSON -> parse line by line. If upstream fails, keep recent as empty.
  const recentText = recentRes.ok ? await recentRes.text() : "";
  const recent = recentText
    .trim()
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  return Response.json(
    { current, recent },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    },
  );
}

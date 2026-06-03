import "dotenv/config";
import { createApp } from "./app";
import { ensureGames } from "./infrastructure/db/ensureGames";

const app = createApp();
const port = Number(process.env.PORT ?? 3001);

async function start() {
  await ensureGames();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { app };

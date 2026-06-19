import "dotenv/config";
import { createApp } from "./app";
import { getEnv } from "./config/env";
import { ensureGames } from "./infrastructure/db/ensureGames";

const env = getEnv();
const app = createApp(env);

async function start() {
  await ensureGames();
  const host = process.env.HOST ?? "0.0.0.0";
  app.listen(env.port, host, () => {
    console.log(`API listening on http://${host}:${env.port}`);
    if (env.webDistPath) {
      console.log(`Serving web UI from ${env.webDistPath}`);
    }
  });
}

if (require.main === module) {
  start().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

export { app };

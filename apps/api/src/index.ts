import "dotenv/config";
import { createApp } from "./app";

const app = createApp();
const port = Number(process.env.PORT ?? 3001);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

export { app };

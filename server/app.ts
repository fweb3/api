import { initializeBotCommands } from "./discord/initialize";
import { middleware } from "./middleware";
import { routes } from "./routes";
import express, { Express } from "express";

const { PORT = 3000 } = process.env;

const app: Express = express();

middleware(app);
routes(app);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is listening on [${PORT}]`);
  initializeBotCommands();
});

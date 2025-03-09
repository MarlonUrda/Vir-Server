import express, { Request, Response, json } from "express";
import { TCPServer } from "./servers/tcpServer";
import { startFTP } from "./servers/ftpServer";
import { db } from "./service/db";
import { getFiles } from "./controllers/controllers";

const app = express();

const tcp = new TCPServer({ port: 57834, host: "127.0.0.1" });

const initialize = async () => {
  tcp.start();
  await startFTP();
  await db.connect();
};

initialize();

app.use(json());
app.get("/", (req, res) => {
  res.send("TCP is running");
});

app.get("/files", async (req: Request, res: Response) => {
  await getFiles(res)
})

app.post("/send-command", (req: Request, res: Response) => {
  const body = req.body as { command: string };

  if (!body) {
    res.json({ message: "Command is required" });
  }

  tcp.send(body.command);
  res.sendStatus(200);
});

app.listen(3009, () => {
  console.log("Server is running on port 3000");
});

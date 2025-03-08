import * as net from "net";

const client = net.createConnection({ port: 57834, host: "127.0.0.1" }, () => {
  console.log("Connected to server!");
  client.write("Hello, server!");
});

client.on("data", (data) => {
  console.log(data.toString());
  client.end();
});

client.on("end", () => {
  console.log("Disconnected from server");
});

client.on("error", (err) => {
  console.error("Client error:", err);
});
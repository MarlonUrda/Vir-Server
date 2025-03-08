import * as net from "net";

interface TCPServerConfig {
  port: number;
  host: string;
}

export class TCPServer {
  private server: net.Server;
  private client: net.Socket | null = null;
  private port: number;
  private host: string;

  constructor(config: TCPServerConfig) {
    this.port = config.port
    this.host = config.host;
    this.server = net.createServer((socket) => {
      
      this.client = socket;
      console.log("Client connected")
      console.log(this.client.remoteAddress)

      socket.on("end", () => {
        console.log("Client disconnected");
        this.client = null;
      })

      socket.on("error", (err) => {
        console.error("Error:", err);
      })
    })

    this.server.on("error", (err) => {
      console.error("Server error:", err); 
    })
  }

  public start(): void {
    this.server.listen(this.port, this.host, () => {
      console.log(`TCP server listening at ${this.host}:${this.port}`);
    });
  }

  public send(command:string): void {
    if (!this.client) {
      console.error("No client connected");
      return;
    }

    this.client.write(command);
    console.log(`Sent command: ${command}`);
  }

  public close(): void {
    this.server.close(() => {
      console.log("TCP server closed");
    });
  }
}
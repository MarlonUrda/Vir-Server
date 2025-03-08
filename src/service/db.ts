import { configDotenv } from "dotenv";
import { Client } from "pg";
import * as path from "path";
import * as fs from "fs";

configDotenv();

const DbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

class Db {
  private client: Client;
  private querys: { [key: string]: string } = {};

  constructor(queriesFilePath: string) {
    this.client = new Client({
      connectionString:
        "postgresql://postgres:123456789@localhost:5432/seguridad",
    });
    this.loadQuerys(queriesFilePath);
  }

  private loadQuerys(filePath: string): void {
    const queryPath = path.resolve(filePath);
    const queriesFileContent = fs.readFileSync(queryPath, "utf-8");
    if (!queriesFileContent) {
      throw new Error(`Could not read queries file at "${filePath}"`);
    }
    this.querys = JSON.parse(queriesFileContent);
    console.log("Queries loaded: " + JSON.stringify(this.querys));
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log("Connected DB");
    } catch (error) {
      console.log("Error connecting DB");
      throw error;
    }
  }

  public async query(query: string, ...args: any[]) {
    const queryKey = this.querys[query];
    if (!queryKey) {
      throw new Error(`No query found with key "${query}"`);
    }

    console.log(queryKey);

    try {
      if (args.length === 0 || args === undefined) {
        const result = await this.client.query(query);
        return result.rows;
      }
      const result = await this.client.query(queryKey, ...args);
      return result.rows;
    } catch (error) {
      console.error(`Error executing query "${query}"`);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await this.client.end();
    console.log("Disconnected DB");
  }
}

const queryPath = process.env.QUERY_PATH;
if (!queryPath) {
  throw new Error("QUERY_PATH environment variable is not defined");
}
export const db = new Db(queryPath);

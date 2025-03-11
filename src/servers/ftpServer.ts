import FtpServer, { FtpConnection } from "ftp-srv";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { db } from "../service/db";

config();

const saveDirectory = path.join(__dirname, "si");

const verifyExistingDirectory = (): void => {
  if (!fs.existsSync(saveDirectory)) {
    fs.mkdirSync(saveDirectory);
  }
};

const handleUpload = async (
  filePath: string,
  connection: FtpConnection
): Promise<void> => {
  console.log(`Received file: ${filePath}`);
  const fileName = path.basename(filePath);

  try {
    await db.query("insert-file", [fileName, filePath]);

    console.log(`File uploaded successfully: ${fileName}`);
  } catch (err) {
    console.error(`Error uploading file: ${err}`);
    connection.close(550, 21);
  }
};

export const startFTP = async (): Promise<void> => {
  verifyExistingDirectory();

  const ftp = new FtpServer({
    url: process.env.FTP_URL,
    pasv_url: process.env.FTP_PASV_URL,
    anonymous: true,
  });

  ftp.on("login", ({ connection, username }, resolve, reject) => {
    console.log(connection.ip);

    connection.on("STOR", (error, fileName) => {
      console.log("s", fileName);

      if (error) {
        console.log(error);
        throw new Error(error);
      }

      handleUpload(fileName, connection);
    });
    resolve({ root: saveDirectory });
  });

  try {
    await ftp.listen();
    console.log("FTP server listening...");
  } catch (err) {
    console.error("Error al iniciar el servidor FTP:", err);
    process.exit(1);
  }
};

import { Request, Response } from "express";
import { db } from "../service/db";
import { getFiles } from "../types/types";

const getFiles = async (res: Response): Promise<void> => {
  try {
    const files: getFiles[] = await db.query("get-files");
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Error fetching files" });
  }
};

export { getFiles };
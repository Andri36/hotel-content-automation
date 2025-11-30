import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  
  // If client is not built (e.g., deployed separately on Firebase),
  // just serve a simple message
  if (!fs.existsSync(distPath)) {
    console.log("[Express] Frontend deployed separately - skipping static file serving");
    app.use("*", (_req, res) => {
      res.status(200).json({
        message: "Backend API is running",
        note: "Frontend is deployed separately on Firebase",
      });
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

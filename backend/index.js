import dotenv from "dotenv"; 
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "http";
import { init } from "./routes/index.js";
import DatabaseManager from "./lib/DatabaseManager.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4600;

// Initialize database connection
DatabaseManager.connect(function (err, conn) {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1); // Exit process if DB connection fails
  } else {
    console.log('Database connected successfully');
  }
});

// Initialize API routes
init(app);

const httpServer = createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});

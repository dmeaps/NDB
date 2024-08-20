import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connect from "./config/database.js";
import routes from "./routes/index.js";

dotenv.config();
const app = express();
const port = 3009;

// Middleware
app.use(express.json());
app.use(cors());

connect();

app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Node.js server running`);
});

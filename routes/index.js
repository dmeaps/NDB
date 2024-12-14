import Router from "express";
import {
  handleURLEntry,
  handleCreatedURL,
  A,
  B,
} from "../controllers/urlController.js";
import { config } from "dotenv";
config();

const SERVER_URL = process.env.SERVER_URL;
const router = Router();
router.get("/", (_, response) => {
  response.send("Hello from NodeJS server withing ERPNEXT with CORS enabled");
});

router.post("/url-entry", handleURLEntry);
if (SERVER_URL == A) {
  console.log("Required entry with created-url");
  router.get("/created-url", handleCreatedURL);
} else if (SERVER_URL == B) {
  console.log("Required entry with cu");
  router.get("/cu", handleCreatedURL);
}

export default router;

import Router from "express";
import {
  handleURLEntry,
  handleCreatedURL,
} from "../controllers/urlController.js";

const router = Router();
router.get("/", (_, response) => {
  response.send("Hello from NodeJS server withing ERPNEXT with CORS enabled");
});

router.post("/ue", handleURLEntry);
router.get("/cu", handleCreatedURL);

export default router;

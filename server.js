import express from "express";
import cors from "cors";
import connect from "./mongoose.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3001;
const serverURL = process.env.SERVER_URL;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connect();

// Define routes
app.get("/", (_, res) => {
  res.send("Hello from the Node.js server within ERPNext with CORS enabled!");
});

app.post("/url-entry", (request, response) => {
  const body = request.body;
  console.log("Got this inside the url-entry link:", body);

  if (!body.name) {
    console.log("DOCNAME NOT FOUND, RETURNING");
    return response.status(400).json({ message: "Document name is required" });
  }

  const urlData = createUrlWithDocumentData(body);
  return response.json({
    message: "Server POST request hit",
    status: 200,
    url: urlData,
  });
});

app.get("/created-url", (req, res) => {
  const { docData } = req.query;
  console.log("Docdata inside created-url", docData);
  if (!docData) {
    return res.status(400).send("Document name is missing");
  }

  const parsedData = JSON.parse(docData);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Document Data</title>
      </head>
      <body>
        <h1>Document Data:</h1>
         <pre>${JSON.stringify(parsedData, null, 2)}</pre>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js server running at http://localhost:${port}`);
});

function createUrlWithDocumentData(docData) {
  const baseUrl = "http://localhost:3001/created-url";
  // Encode and serialize the document data
  const encodedData = encodeURIComponent(JSON.stringify(docData));
  return `${baseUrl}?docData=${encodedData}`;
}

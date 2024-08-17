import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3009;
const serverURL = process.env.SERVER_URL;

// Middleware
app.use(express.json());
app.use(cors());

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

  if (!docData) {
    return res.status(400).send("Document data is missing");
  }

  // Decode and parse the document data
  const parsedData = JSON.parse(decodeURIComponent(docData));

  // Extract only the fields you want to display
  const filteredData = {
    service_provider_name: parsedData.service_provider_name,
    device_id: parsedData.device_id,
    battery_type: parsedData.battery_type,
    battery_capacity: parsedData.battery_capacity,
    device_type: parsedData.device_type,
    sim_imei: parsedData.sim_imei,
  };

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wagon Tracker</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            color: #2c3e50;
          }
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
          }
          .field {
            margin-bottom: 15px;
          }
          .field label {
            font-weight: bold;
            color: #34495e;
          }
          .field span {
            display: block;
            padding: 5px 0;
            background-color: #ecf0f1;
            border-radius: 4px;
            margin-top: 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Document Data:</h1>
          <div class="field">
            <label>Service Provider Name:</label>
            <span>${filteredData.service_provider_name}</span>
          </div>
          <div class="field">
            <label>Device ID:</label>
            <span>${filteredData.device_id}</span>
          </div>
          <div class="field">
            <label>Battery Type:</label>
            <span>${filteredData.battery_type}</span>
          </div>
          <div class="field">
            <label>Battery Capacity:</label>
            <span>${filteredData.battery_capacity}</span>
          </div>
          <div class="field">
            <label>Device Type:</label>
            <span>${filteredData.device_type}</span>
          </div>
          <div class="field">
            <label>SIM IMEI:</label>
            <span>${filteredData.sim_imei}</span>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Node.js server running`);
});

function createUrlWithDocumentData(docData) {
  const baseUrl = `${serverURL}/created-url`;
  // Encode and serialize the document data
  const encodedData = encodeURIComponent(JSON.stringify(docData));
  return `${baseUrl}?docData=${encodedData}`;
}

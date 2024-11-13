import { wagonTrackerModel } from "../models/WagonTracker.js";
import dotenv from "dotenv";

dotenv.config();

function render404(
  response,
  message = "The document you are looking for does not exist."
) {
  return response.status(404).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>404 Not Found</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            background-color: #f4f4f4;
            color: #333;
          }
          h1 {
            font-size: 48px;
            color: #e74c3c;
          }
          p {
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <h1>404 Not Found</h1>
        <p>${message}</p>
      </body>
    </html>
  `);
}

function renderDocument(response, document) {
  const deviceType = document.device_type === "solar" ? True : False;

  return response.send(`
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
          <h1>Tracking Details:</h1>
          <div class="field">
            <label>DEVID</label>
            <span>${document.device_id || "N/A"}</span>
          </div>
          <div class="field">
            <label>VNDCD</label>
            <span>${document.vendor_code || "N/A"}</span>
          </div>
          <div class="field">
            <label>DEVMD</label>
            <span>${document.device_model_number || "N/A"}</span>
          </div>
          <div class="field">
            <label>DIMEI</label>
            <span>${document.sim_imei || "N/A"}</span>
          </div>
          <div class="field">
            <label>SFLAG</label>
            <span>${deviceType}</span>
          </div>
          <div class="field">
            <label>BATTY</label>
            <span>${document.battery_type || "N/A"}</span>
          </div>
          <div class="field">
            <label>BATCP</label>
            <span>${document.battery_capacity || "N/A"}</span>
          </div>
        </div>
      </body>
    </html>
  `);
}

// Function to handle URL entry updates
const SERVER_URL = process.env.SERVER_URL;

export async function handleURLEntry(request, response) {
  const { body } = request;
  console.log("Got this inside the url-entry body ", body);

  if (!body.name) {
    console.log("DOCUMENT NAME NOT FOUND, ABORTING");
    return response.status(403).json({
      message: "Document name absent",
      status: 403,
    });
  }

  try {
    const existingEntry = await wagonTrackerModel.findOneAndUpdate(
      { docname: body.name },
      { $set: body },
      { new: true, upsert: true }
    );

    console.log(
      existingEntry
        ? "Updated existing Wagon Tracker Entry"
        : "Created new Wagon Tracker Entry"
    );

    const docname = body.name;
    const url = `${SERVER_URL}/created-url?docname=${docname}`;

    return response.json({
      message: "Server POST Request was hit",
      status: 200,
      url: url,
    });
  } catch (error) {
    console.error("Error handling URL entry", error);
    return response.status(500).json({
      message: "Error processing request",
      status: 500,
    });
  }
}

// Function to handle document fetching and rendering
export async function handleCreatedURL(request, response) {
  const { docname } = request.query;

  if (!docname) {
    return render404(response, "Document name is missing.");
  }

  try {
    const document = await wagonTrackerModel.findOne({ docname });

    if (!document) {
      return render404(response);
    }

    return renderDocument(response, document.toObject());
  } catch (error) {
    console.error("Error fetching document", error);
    return response.status(500).json({
      message: "Error fetching document",
      status: 500,
    });
  }
}

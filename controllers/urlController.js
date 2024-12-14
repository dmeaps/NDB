import {
  newWagonTrackerModel,
  oldWagonTrackerModel,
} from "../models/WagonTracker.js";
import dotenv from "dotenv";

dotenv.config();

const SERVER_URL = process.env.SERVER_URL;
export const newBackend = "https://ndb-1.onrender.com";
export const oldBackend = "https://nodejs-backend-m9dh.onrender.com";

function render404(
  response,
  message = "The document you are looking for does not exist."
) {
  console.log("Rendering 404 with message:", message);
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
  console.log("Rendering document:", document);
  const deviceType = document.device_type === "solar" ? "True" : "False";
  const unavailable = (field, label) => field || `Unavailable ${label}`;
  return response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wagon Tracker</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 700px;
            width: 100%;
            box-sizing: border-box;
          }
          h1 {
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
          }
          .fields {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
          }
          .field {
            flex: 1 1 45%;
            min-width: 180px;
            padding: 10px;
            background-color: #ecf0f1;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .field label {
            font-weight: bold;
            color: #34495e;
            margin-bottom: 5px;
            display: block;
          }
          .field span {
            display: block;
            color: #555;
            font-size: 14px;
          }
          @media (max-width: 600px) {
            .field {
              flex: 1 1 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Wagon Tracker</h1>
          <div class="fields">
            <div class="field">
              <label>DEVID</label>
              <span>${unavailable(document.device_id, "Device ID")}</span>
            </div>
            <div class="field">
              <label>VNDCD</label>
              <span>${unavailable(document.vendor_code, "Vendor Code")}</span>
            </div>
            <div class="field">
              <label>DEVMD</label>
              <span>${unavailable(
                document.device_model_number,
                "Device Model Number"
              )}</span>
            </div>
            <div class="field">
              <label>DIMEI</label>
              <span>${unavailable(document.sim_imei, "SIM IMEI")}</span>
            </div>
            <div class="field">
              <label>SFLAG</label>
              <span>${deviceType}</span>
            </div>
            <div class="field">
              <label>BATTY</label>
              <span>${unavailable(document.battery_type, "Battery Type")}</span>
            </div>
            <div class="field">
              <label>BATCP</label>
              <span>${unavailable(
                document.battery_capacity,
                "Battery Capacity"
              )}</span>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
}

function getModelByServerURL(serverURL) {
  console.log("Determining model for server URL:", serverURL);
  if (serverURL == oldBackend) {
    console.log("Using old wagon tracker schema");
    return oldWagonTrackerModel;
  } else if (serverURL == newBackend) {
    console.log("Using new wagon tracker schema");
    return newWagonTrackerModel;
  } else {
    console.error("Invalid server URL provided:", serverURL);
    throw new Error("Invalid server URL");
  }
}

export async function handleURLEntry(request, response) {
  console.log("Handling URL entry with request body:", request.body);
  const { body } = request;
  if (!body.name) {
    console.log("Document name not found in request body");
    return response.status(403).json({
      message: "Document name absent",
      status: 403,
    });
  }

  try {
    const model = getModelByServerURL(SERVER_URL);
    console.log("Resolved model:", model);
    const queryField =
      SERVER_URL === newBackend ? { dn: body.name } : { docname: body.name };
    console.log("Query field for findOneAndUpdate:", queryField);

    const existingEntry = await model.findOneAndUpdate(
      queryField,
      { $set: body },
      { new: true, upsert: true }
    );
    console.log(
      existingEntry
        ? "Updated existing wagon tracker entry"
        : "Created new wagon tracker entry"
    );

    const identifier = SERVER_URL == newBackend ? "dn" : "docname";
    const urlPath = SERVER_URL == newBackend ? "cu" : "created-url";
    const url = `${SERVER_URL}/${urlPath}?${identifier}=${body.name}`;
    console.log("Generated URL path:", url);

    return response.json({
      message: "Server POST request was hit",
      status: 200,
      url: url,
    });
  } catch (error) {
    console.error("Error handling URL entry:", error);
    return response.status(500).json({
      message: "Error processing request",
      status: 500,
    });
  }
}

export async function handleCreatedURL(request, response) {
  console.log("Handling created URL with query:", request.query);
  const { dn, docname } = request.query;
  if (!dn && !docname) {
    console.log("Document identifier is missing in query");
    return render404(response, "Document identifier is missing.");
  }

  try {
    const model = getModelByServerURL(SERVER_URL);
    console.log("Resolved model:", model);
    const queryField = SERVER_URL === newBackend ? { dn } : { docname };
    console.log("Query field for fetching document:", queryField);

    const document = await model.findOne(queryField);
    if (!document) {
      console.log("No document found for query field:", queryField);
      return render404(response);
    }

    console.log("Document found:", document);
    return renderDocument(response, document.toObject());
  } catch (error) {
    console.error("Error fetching document:", error);
    return response.status(500).json({
      message: "Error fetching document",
      status: 500,
    });
  }
}

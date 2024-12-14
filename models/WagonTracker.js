import mongoose, { model, Schema, modelNames } from "mongoose";

const wagonTrackerSchema = new Schema(
  {
    dn: { type: String, required: true },
    service_provider_name: { type: String },
    device_id: { type: String },
    vendor_code: { type: String },
    device_model_number: { type: String },
    battery_type: { type: String },
    battery_capacity: { type: String },
    device_type: { type: String },
    sim_imei: { type: String },
  },
  {
    timestamps: true,
  }
);

const oldWagonTrackerSchema = new Schema(
  {
    docname: { type: String, required: true },
    service_provider_name: { type: String },
    device_id: { type: String },
    vendor_code: { type: String },
    device_model_number: { type: String },
    battery_type: { type: String },
    battery_capacity: { type: String },
    device_type: { type: String },
    sim_imei: { type: String },
  },
  {
    timestamps: true,
  }
);

const newModelName = "Wagon_Tracker";
const oldModelName = "Wagon_Tracker";
const existingModels = modelNames();

export const wagonTrackerModel = existingModels.includes(newModelName)
  ? mongoose.model(newModelName)
  : model(newModelName, wagonTrackerSchema);

export const oldWagonTrackerModel = existingModels.includes(oldModelName)
  ? mongoose.model(oldModelName)
  : model(oldModelName, oldWagonTrackerSchema);

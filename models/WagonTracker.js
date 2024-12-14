import mongoose, { model, Schema, modelNames } from "mongoose";

const newWagonTrackerSchema = new Schema(
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

const newModelName = "New_Wagon_Tracker";
const oldModelName = "Old_Wagon_Tracker";
const existingModels = modelNames();

export const newWagonTrackerModel = existingModels.includes(newModelName)
  ? mongoose.model(newModelName)
  : model(newModelName, newWagonTrackerSchema);

export const oldWagonTrackerModel = existingModels.includes(oldModelName)
  ? mongoose.model(oldModelName)
  : model(oldModelName, oldWagonTrackerSchema);

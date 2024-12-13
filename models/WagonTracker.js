import { model, Schema, modelNames } from "mongoose";

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

const modelName = "Wagon_Tracker";
const existingModels = modelNames();

export const wagonTrackerModel = existingModels.includes(modelName)
  ? mongoose.model(modelName)
  : model(modelName, wagonTrackerSchema);

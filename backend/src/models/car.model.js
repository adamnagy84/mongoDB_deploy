import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    date: {
      type: Date, //ÉÉÉÉ-HH-NN = format required
      required: [true, "Date is required"],
      trim: true,
      min: ["1926-01-01", "Cannot be older than 100 years."],
      max: [Date.now, "No cars are made in the future"],
    },
    color: {
      type: String,
      minlength: 3,
      maxlength: 20,
    },
  },
  { timestamps: true },
);

export const Car = mongoose.model("Car", carSchema);

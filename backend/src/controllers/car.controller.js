import { Car } from "../models/car.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCar = asyncHandler(async (req, res) => {
  const { brand, model, date, color } = req.body;

  if (!brand?.trim() || !model?.trim() || date === null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const car = await Car.create({ brand, model, date, color });

  res.status(201).json({ message: "Car created successfully", car });
});

const getCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({}).lean();
  res.status(200).json({ cars });
});

const updateCar = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No data provided for update" });
  }

  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  res.status(200).json({ message: "Car updated successfully", car });
});

const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findByIdAndDelete(req.params.id);

  if (!car) {
    return res.status(404).json({ message: "Car not found" });
  }

  res.status(200).json({ message: "Car deleted successfully." });
});

export { createCar, getCars, updateCar, deleteCar };

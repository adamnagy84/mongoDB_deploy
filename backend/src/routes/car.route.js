import { Router } from "express";

import {
  createCar,
  deleteCar,
  updateCar,
  getCars,
} from "../controllers/car.controller.js";

import { validateObjectId } from "../middlewares/validateObjectId.js";

const carRouter = Router();

carRouter.post("/", createCar);
carRouter.get("/", getCars);

carRouter.patch("/:id", validateObjectId("id"), updateCar);
carRouter.delete("/:id", validateObjectId("id"), deleteCar);

export default carRouter;

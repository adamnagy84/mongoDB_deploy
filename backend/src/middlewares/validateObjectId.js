import mongoose from "mongoose";

export const validateObjectId =
  (
    paramName = "id", //id parametert ellenorzi
  ) =>
  // "/post utan a :id-t kiolvassa", ez lesz a req.params.id
  (req, res, next) => {
    const id = req.params[paramName]; //[paramName] azt jelzi, hogy req.params.id -->ne csak id-val mukodjon azert csinaltuk igy

    if (!mongoose.Types.ObjectId.isValid(id)) {
      //az ertek ervenyes mongoDB object id -e?! Check-eljuk
      //ha nem az --> 400-as hibat adunk vissza, nem engedjuk tovabb a kerest
      return res.status(400).json({ message: "Invalid id format" });
    }

    next(); //ez adja at a kovetkezo fn-nek a futast
  };

import mongoose from "mongoose"; //ORM --> kommunikal a mongoDB-vel, server tudja tole kerni adatokat
import { DB_NAME } from "./constants.js"; //adatbazis neve mongo-n belul, atlas, cluster-en belul ezt latjuk, m adatbazis nev

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; //kiolvassuk a .env fajlbol vesszuk ki a valtozokat
    if (!uri) {
      throw new Error("Missing mongoDB uri");
    }
    const connectionInstance = await mongoose.connect(uri, { dbName: DB_NAME }); //csatlakozas a mongoDB-hez, uri+object, dbName opcioval mondjuk meg, melyik adatbazishoz csatlakozzon
    console.log(
      `MongoDB connected: ${connectionInstance.connection.host}/${DB_NAME}`, //host + adatbazis nevet logoljuk amihez csatlakoztunk
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); //process.exit leallitja a node.js alkalmazast --> adatbazis nelkul backend nem menne
  }
};

export default connectDB;

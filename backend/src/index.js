import "dotenv/config";
// .env --> a vite-ben alapbol help, hogy tudja kezelni a .envet.
// Itt kell seged library, hogy .envbol ki tudjuk szedni az adatokat.
// Lehetove teszi, hogy a .env fajl valtozoit elerjuk

import app from "./app.js"; //app.js-bol importoljuk az appunkat
import connectDB from "./config/database.js"; // fn. amit a config mappaban megirtunk -->ezzel csatlakozunk a db-hez

const startServer = async () => {
  //ez inditja el a teljes alkalmazast
  //sok mindent ellenorizni kell --> async

  try {
    await connectDB(); //meghivjuk a kapcsolodast

    const port = process.env.PORT || 8000; //kornyezeti valtozobol kiolvassuk a port-ot. Ha nincs benne --> default:8000
    const server = app.listen(port, () => {
      //elinditjuk az express servert, megmondjuk melyik porton
      console.log(`This server is running on port: ${port}`);
    });

    server.on("error", (err) => {
      // alacsonyt szintu server hibak kezelese
      // pl.: foglalt a port (ESZTI és a MAC!!! :D )
      // halozati hiba ha van, az is itt derul ki -->weak signal
      console.error("Server error:", err);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

startServer(); //elindul a server

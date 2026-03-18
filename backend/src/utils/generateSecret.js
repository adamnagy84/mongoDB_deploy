import crypto from "crypto";
/**
 * JWT Secret generáló függvény
 * @param {number} length - A generált byte-ok hossza (min. 32 ajánlott a 256-bites biztonsághoz)
 */
function generateJwtSecret(length = 64) {
  // Kriptográfiailag erős véletlen byte-ok generálása, majd hexadecimális formátumba alakítása
  const secret = crypto.randomBytes(length).toString("hex");

  console.log("--- Új JWT Secret Generálva ---");
  console.log(secret);
  console.log("-------------------------------");
  console.log(`Hossz: ${secret.length} karakter`);
}

generateJwtSecret();

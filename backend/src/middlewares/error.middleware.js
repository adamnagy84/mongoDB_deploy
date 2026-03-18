//next megkapja a hibat, es itt eldontjuk mi tortenjen
//milyen errorokat irunk vissza a usernek

export const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found" }); // ha olyan route-ot probalunk hasznalni ami nem letezik, akkor futunk bele ebbe. pl.: /api/v1/kiscicaaminincs
};

//next osszekapcsol 2 logikat --> 2 fn: 1 = add 2 numbers 2 = printeli console-ba. NEXT --> if 1 is ok --> run fn 2. with parameter of 1st fn.
//ha 1st fn rossz --> next -->hibat (status code-ot magaba foglalja) --> errorhandler-nek atadja
//next = reserved keyword backend-en

export const errorHandler = (err, req, res, next) => {
  //kozponti hibakezelo
  //minden egyes hiba amit a next-tel elkapunk ide fut be

  if (err?.name === "CastError" && err?.kind === "ObjectId") {
    //CastError --> error neve, ezzel jelzi a rosszul megadott params kulcsot. pl. id
    //error fajtája objectid lesz

    res.status(400).json({ message: "Invalid ID format" });
  }

  if (err?.code === 11000) {
    //Duplicate key error-t jelol a 11000 kod
    const fields = Object.keys(err.keyValue || {}); //kiveszi melyik mezok okoztak a hibak --> errornak a kulcsertekein meghivja az Object.keys-t. Ha nincs error akkor se torjon ossze az alkalmazas, ezert kell a default {}
    return res.status(409).json({ message: "Duplicate value", fields }); //message es code melle odairjuk mely field-ekkel voltak a bajok
    //409es statuscode jeloli a duplikalt adatot
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res
      .status(400)
      .json({ message: "Validation failed", errors: messages });
  }

  const status = err?.statusCode || 500; // ha az error object tartalmaz statuscode-ot -->ezt hasznaljuk, kulonben 500-at hasznalunk, mi mondjuk meg. 500 internal server error.

  res.status(status).json({ message: err?.message || "Internal server error" });
};

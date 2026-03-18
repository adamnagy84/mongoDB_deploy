import mongoose from "mongoose";

//Schema = leirja milyen mezoi vannak egy post dokumentumnak
//milyen szabalyok vonatkoznak ra, azt is leirja
//type - milyen tipusu az adat amit elmentunk
//required - kotelezo-e a field-je
//trim - leszedjuk a felesleges space-ek
//min-max - milyen hosszu lehessen minimum es maximum

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true, //ha mar van ilyen nevu dokument az adatbazisban, nem enged megegyet letrehozni. Error code = 11000
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: 1,
      max: 120,
    },
  },
  { timestamps: true },
);

//timestamps = createdAt, updateAt --> hatterben elkeszul magatol, mongoDB megcsinalja

//a model koti ossze a schema-t az adatbazissal
//Post = mongoDB-ben "posts" collection lesz automatikusan
//required array = syntax --> ha nem lenne igaz amit megadtunk szabaly, mivel valaszoljunk ra. pl.: ha valaki kihagyta a nevet, azt irjuk ki, hogy name is required
export const Post = mongoose.model("Post", postSchema);

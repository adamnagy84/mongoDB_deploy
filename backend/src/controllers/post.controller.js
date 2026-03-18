import { Post } from "../models/post.model.js"; //post-ot importolunk --> a model fajlokba milyen field-ek kellenek a documentumba --> semahoz kell
import { asyncHandler } from "../utils/asyncHandler.js"; //leveszi a terhelest rolunk --> try-catch-et nem kell irni minden fn-be

//metodusok itt kezdodnek
const createPost = asyncHandler(async (req, res) => {
  const { name, description, age } = req.body;

  if (!name?.trim() || !description?.trim() || age === null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const post = await Post.create({ name, description, age }); //egy Post fajta modelt szeretnek kesziteni
  /* const post = await Post.save({ name, description, age }); */ //__v csak itt frissül

  res.status(201).json({ message: "Post created successfully", post }); //jelezzuk a usernek, h sikeres a post, visszakuldjuk az adatait
});

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).lean(); //az összes dokumentumot visszaadja ha üres {} adunk meg. {} minden dokumentumot amit megtalalsz, add vissza
  //lean --> JS adatot ad vissza, nem mongoose adatokat akarunk kapni, tudunk vele dolgozni egyből
  res.status(200).json({ posts }); //összes postot visszakuldjuk
});

const updatePost = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    //megvizsgaljuk nem ures-e a body-ban az object. Ha 1 kulcs sincs benne, akkor ures az egesz, nem tudunk update-elni, nem fut tovabb a kod
    return res.status(400).json({ message: "No data provided for update" });
  }

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    //megkeressuk melyik dokumentumrol van szo. A request params-bol erkezo id-t vizsgaljuk
    //route-oknal a /:id -rol van szo
    //req.body-ban vannak a valtoztatni valo adatok
    new: true, //update-elunk egy dokumentumot, ezt kuldjuk el a 41.sorban. Enelkul a 41.sorban az update elotti allapota lenne
    runValidators: true, //szabalyok a model-ben, mongoDB timestamp-je is ebbol frissul. Amikor letrehozunk egy uj dokumentumot, alapbol lefutnak a validatorok. Update-nel nezze meg ujbol
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" }); //id alapjan nem talalunk postot --> uzenet, hogy nincs ilyen post
  }

  res.status(200).json({ message: "Post updated successfully", post });
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id); //id-vel azonositjuk a dokumentumot, es kitoroljuk az adatbazisbol

  if (!post) {
    return res.status(404).json({ message: "Post not found" }); //not found ha nincs ilyen id
  }

  res.status(200).json({ message: "Post deleted successfully." }); //ha minden ok, toroltuk sikeresen
});

export { createPost, getPosts, updatePost, deletePost };

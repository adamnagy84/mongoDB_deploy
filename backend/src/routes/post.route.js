import { Router } from "express"; //azert kell, mert eddig. app.get(eleresi utvonal, fn ami lefusson)
//Router --> bizonyos collection-nek kulon route-okat adhatunk

import {
  createPost,
  deletePost,
  updatePost,
  getPosts,
} from "../controllers/post.controller.js"; //controller-bol beimportoljuk a logikat

import { validateObjectId } from "../middlewares/validateObjectId.js"; //params-ben megnezze az id formatumot. HA nicns hiba, tovabb engedi az update postot

const router = Router(); //router peldanyt letrehozunk. Szetosztjuk a "/api/v1/posts" utan, milyen variacioi vannak a route-nak.

router.post("/", createPost); //csak az endpoint ami meg van adva, arra kell kuldeni, a request tipusa donti el, hogy: createpost vagy getPosts fog lefutni
router.get("/", getPosts);

router.patch("/:id", validateObjectId("id"), updatePost); //next mondja meg, hogy a validateObject utan tudjuk az updatePost-ot inditani
router.delete("/:id", validateObjectId("id"), deletePost);

export default router; //szeretnenk az app.js-ben felhasznalni --> exportoljuk. Nincs logika, csak megmondjuk melyik endpointon mi tortenjen

import { Router } from "express";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
import { addWishListItem, getWishList, removeWishListItem } from "./wishlist.controller";
const wishlistRoutes = Router()

wishlistRoutes.post("/add", jwtAuth, addWishListItem)
wishlistRoutes.get("/get", jwtAuth, removeWishListItem)
wishlistRoutes.delete("/delete/id/:id", jwtAuth, getWishList)

export default wishlistRoutes  
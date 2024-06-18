import { Router } from "express";
import { addWishListItem, getWishList, removeWishListItem } from "./wishlist.controller.js";
import { jwtAuth } from "../../Middlewares/auth.middleware.js";
const wishlistRoutes = Router()

wishlistRoutes.post("/add", jwtAuth, addWishListItem)
wishlistRoutes.get("/get", jwtAuth, getWishList)
wishlistRoutes.delete("/delete/id/:id", jwtAuth, removeWishListItem)

export default wishlistRoutes  
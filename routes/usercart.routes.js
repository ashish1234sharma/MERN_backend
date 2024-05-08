import express from 'express';
import { AddToCart, GetCartProducts, DeleteCart } from '../controllers/usercart.controller.js';
import { Auth } from '../middlewares/auth.js';

const CartRoute = express.Router();

CartRoute.post("/product/cart", Auth, AddToCart)
CartRoute.get("/products/cart", Auth, GetCartProducts)
CartRoute.delete("/product/cart/:_id", Auth, DeleteCart)

export { CartRoute };

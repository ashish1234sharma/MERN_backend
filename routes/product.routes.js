import express from 'express';
import { AddProduct, UpdateProduct, GetProducts, DeleteProduct } from '../controllers/product.controller.js';
import { Auth } from '../middlewares/auth.js';

const ProductRoute = express.Router();

ProductRoute.post("/product/new/product", Auth, AddProduct)
ProductRoute.patch("/product/update/:_id", Auth, UpdateProduct)
ProductRoute.get("/products", Auth, GetProducts)
ProductRoute.get("/product/:_id", Auth, GetProducts)
ProductRoute.delete("/product/:_id/delete", Auth, DeleteProduct)

export { ProductRoute };

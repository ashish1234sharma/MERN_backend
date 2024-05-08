import express from 'express';
import { ProductCheckout, HistoryCheckouts, HistoryCheckoutsByUser } from '../controllers/checkout.contoller.js';
import { Auth } from '../middlewares/auth.js';
import { UserIdExit } from '../utils/UserIdExit.js';
import { ProductIsExit } from '../utils/ProductIsExit.js';
import { CheckoutIsExit } from '../utils/CheckoutIsExit.js';

const CheckoutRoute = express.Router();

CheckoutRoute.post("/product/checkout", Auth, ProductCheckout)
CheckoutRoute.get("/product/checkouts/history", Auth, HistoryCheckouts)
CheckoutRoute.get("/product/checkout/:_id", Auth, CheckoutIsExit, HistoryCheckouts)
CheckoutRoute.get("/product/user/:_id/checkout", Auth, UserIdExit, HistoryCheckoutsByUser)

export { CheckoutRoute };

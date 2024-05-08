import express from 'express';
import { GetSummary } from '../controllers/summary.controller.js';
import { Auth } from '../middlewares/auth.js';

const SummaryRoute = express.Router();

SummaryRoute.get("/admin/summary", Auth, GetSummary)

export { SummaryRoute };

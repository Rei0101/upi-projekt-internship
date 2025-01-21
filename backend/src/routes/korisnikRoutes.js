import express from "express";
import {
  loginUser,
  getTimetable,
  getAllGroups,
} from "../viewModels/korisnikViewModel.js";
import userTypeMiddleWare from "../utils/userTypeMiddleWare.js";

const router = express.Router();

router.post("/login", userTypeMiddleWare, loginUser);
router.post("/raspored", userTypeMiddleWare, getTimetable);
router.post("/sve-grupe/:id?", getAllGroups);

export default router;

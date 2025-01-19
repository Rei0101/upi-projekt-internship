import express from "express";
import {
  loginUser,
  getTimetable,
  getAllGroups,
} from "../viewModels/korisnikViewModel.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/raspored", getTimetable);
router.post("/sve-grupe/:id?", getAllGroups);

export default router;

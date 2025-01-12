import express from "express";
import {
  loginUser,
  getStudentTimetable,
} from "../viewModels/korisnikViewModel.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/raspored", getStudentTimetable);

export default router;

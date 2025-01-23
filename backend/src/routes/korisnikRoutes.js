import express from "express";
import {
  loginUser,
  getTimetable,
  getAllGroups,
  getToDo,
  updateToDo
} from "../viewModels/korisnikViewModel.js";
import userTypeMiddleWare from "../utils/userTypeMiddleWare.js";

const router = express.Router();

router.post("/login", userTypeMiddleWare, loginUser);
router.post("/raspored", userTypeMiddleWare, getTimetable);
router.post("/sve-grupe/:id?", userTypeMiddleWare, getAllGroups);
router.get("/todo", userTypeMiddleWare, getToDo);
router.put("/novi-todo", userTypeMiddleWare, updateToDo);

export default router;
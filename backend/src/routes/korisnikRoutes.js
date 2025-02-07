import express from "express";
import {
  loginUser,
  getTimetable,
  getAllGroups,
  getToDo,
  updateToDo,
  changeGroup,
  sendExchangeRequest,
  getExchangeRequests,
  handleExchangeResponse,
  getColloquium,
  newColloquium,
  changeSchedule,
  getGroupAndParticipants
} from "../viewModels/korisnikViewModel.js";
import { authenticateToken } from "../utils/authMiddleware.js";
import userTypeMiddleWare from "../utils/userTypeMiddleWare.js";

const router = express.Router();

router.post("/login", userTypeMiddleWare, loginUser);
router.post("/raspored", authenticateToken, userTypeMiddleWare, getTimetable);
router.post("/sve-grupe/:id?", authenticateToken, userTypeMiddleWare, getAllGroups);

router.post("/todo", authenticateToken, userTypeMiddleWare, getToDo);
router.put("/novi-todo", userTypeMiddleWare, updateToDo);

router.post("/dobavi-sudionike", getGroupAndParticipants);
router.patch("/promjena-grupe", changeGroup);
router.post("/zahtjev-razmjene", sendExchangeRequest);
router.post("/dobavi-zahtjev", authenticateToken, getExchangeRequests);
router.post("/obradi-zahtjev", handleExchangeResponse);

router.post("/kolokviji", authenticateToken, userTypeMiddleWare, getColloquium)
router.post("/novi-kolokvij", newColloquium)

router.patch("/promjena-termina", changeSchedule);



export default router;

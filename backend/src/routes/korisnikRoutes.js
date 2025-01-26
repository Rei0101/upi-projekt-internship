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
  changeSchedule
} from "../viewModels/korisnikViewModel.js";
import userTypeMiddleWare from "../utils/userTypeMiddleWare.js";

const router = express.Router();

router.post("/login", userTypeMiddleWare, loginUser);
router.post("/raspored", userTypeMiddleWare, getTimetable);
router.post("/sve-grupe/:id?", userTypeMiddleWare, getAllGroups);

router.post("/todo", userTypeMiddleWare, getToDo);
router.put("/novi-todo", userTypeMiddleWare, updateToDo);

router.patch("/promjena-grupe", changeGroup);
router.post("/zahtjev-razmjene", sendExchangeRequest);
router.post("/dobavi-zahtjev", getExchangeRequests);
router.post("/obradi-zahtjev", handleExchangeResponse);

router.post("/kolokviji", userTypeMiddleWare, getColloquium)
router.post("/novi-kolokvij", newColloquium)

router.patch("/promjena-termina", changeSchedule);



export default router;

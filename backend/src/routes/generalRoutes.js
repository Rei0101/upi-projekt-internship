import express from "express";
import {
  getWelcomeMessage,
  getTablicaData,
  getTablicaById,
  getAllowedTables
} from "../viewModels/generalViewModel.js";
import dozvoljeneTablice from "../utils/dozvoljeneTablice.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";

const validateTablica = (req, res, next) => {
  const { tablica } = req.params;

  if (!dozvoljeneTablice.includes(tablica)) {
    return ERROR_CODE.DATABASE_ERROR(res)
  }
  next(); 
};

const router = express.Router();

router.get("/", getWelcomeMessage);
router.get("/tablice", getAllowedTables);
router.get("/tablice/:tablica", validateTablica, getTablicaData);
router.get("/tablice/:tablica/:id", validateTablica, getTablicaById);

export default router;

import { queryDatabase } from "../models/pool.js";
import dozvoljeneTablice from "../utils/dozvoljeneTablice.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";

const getWelcomeMessage = (req, res) => {
  res.json({
    success: true,
    message: "Dobrodošli na API za ScheduleIT.",
  });
};

const getAllowedTables = (req, res) => {
  res.json({
    success: true,
    message: {
      "dozvoljene tablice": dozvoljeneTablice,
    },
  });
};

const getTablicaData = async (req, res) => {
  const { tablica } = req.params;

  try {
    const data = await queryDatabase(`SELECT * FROM ${tablica}`);
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error.stack);
    return res.status(500).json(ERROR_CODE.DATABASE_ERROR(res));
  }
};

const getTablicaById = async (req, res) => {
  const { id, tablica } = req.params;

  try {
    const data = await queryDatabase(`SELECT * FROM ${tablica} WHERE id = $1`, [
      id,
    ]);

    if (data.length === 0) {
      return res.status(404).json(ERROR_CODE.RESOURCE_NOT_FOUND(res));
    }

    res.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error.stack);
    return res.status(500).json(ERROR_CODE.DATABASE_ERROR(res));
  }
};

export { getWelcomeMessage, getAllowedTables, getTablicaData, getTablicaById };

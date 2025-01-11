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
      "dozvoljene tablice": dozvoljeneTablice
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
    const data = await queryDatabase(`SELECT * FROM ${tablica} WHERE id = $1`, [id]);

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

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await queryDatabase(
      "SELECT * FROM student WHERE email = $1 AND lozinka = $2",
      [username, password]
    );

    if (result.length === 0) {
      return ERROR_CODE.NOT_AUTHORIZED(res);
    }

    res.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Greška pri prijavi:", error.stack);
    return res.status(500).json(ERROR_CODE.DATABASE_ERROR(res));
  }
};

const getStudentTimetable = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return ERROR_CODE.INVALID_EMAIL(res);
  }

  try {
    // Pronađi studenta na temelju e-mail-a
    const studentQuery = await queryDatabase(
      "SELECT studij_id, grupa_id FROM student WHERE email = $1",
      [email]
    );

    if (studentQuery.length === 0) {
      return ERROR_CODE.RESOURCE_NOT_FOUND(res);
    }

    // Dohvati termine s detaljnim informacijama
    const { studij_id, grupa_id } = studentQuery[0];

    const terminiQuery = await queryDatabase(
      `SELECT 
        t.dan_u_tjednu,
        t.pocetak,
        t.kraj,
        k.naziv AS kolegij_naziv,
        CONCAT(pr.ime, ' ', pr.prezime) AS profesor_ime,
        g.naziv AS grupa_naziv,
        p.naziv AS prostorija_naziv
      FROM termin t
      JOIN kolegij_grupa_profesor kgp ON t.kolegij_id = kgp.kolegij_id AND t.grupa_id = kgp.grupa_id
      JOIN profesor pr ON kgp.profesor_id = pr.id
      JOIN kolegij k ON t.kolegij_id = k.id
      JOIN grupa g ON t.grupa_id = g.id
      JOIN prostorija p ON t.prostorija_id = p.id
      WHERE k.studij_id = $1 AND t.grupa_id = $2
      ORDER BY
        CASE 
          WHEN t.dan_u_tjednu = 'Ponedjeljak' THEN 1
          WHEN t.dan_u_tjednu = 'Utorak' THEN 2
          WHEN t.dan_u_tjednu = 'Srijeda' THEN 3
          WHEN t.dan_u_tjednu = 'Četvrtak' THEN 4
          WHEN t.dan_u_tjednu = 'Petak' THEN 5
          ELSE 6
        END,
        t.pocetak`,
      [studij_id, grupa_id]
    );

    res.json({
      success: true,
      data: terminiQuery,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju rasporeda:", error.stack);
    return ERROR_CODE.DATABASE_ERROR(res);
  }
};

// Export all functions
export {
  getWelcomeMessage,
  getAllowedTables,
  getTablicaData,
  getTablicaById,
  loginUser,
  getStudentTimetable,
};

import { queryDatabase } from "../models/pool.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";

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
    
    const terminiQuery = await queryDatabase(
      `SELECT 
        t.dan_u_tjednu,
        t.pocetak,
        t.kraj,
        k.naziv AS kolegij_naziv,
        CONCAT(pr.ime, ' ', pr.prezime) AS profesor_ime,
        g.naziv AS grupa_naziv,
        p.naziv AS prostorija_naziv,
        p.kapacitet AS prostorija_kapacitet
      FROM termin t
        JOIN kolegij_grupa_profesor kgp ON t.kolegij_id = kgp.kolegij_id AND t.grupa_id = kgp.grupa_id
        JOIN profesor pr ON kgp.profesor_id = pr.id
        JOIN kolegij k ON t.kolegij_id = k.id
        JOIN grupa g ON t.grupa_id = g.id
        JOIN prostorija p ON t.prostorija_id = p.id
        JOIN student_kolegij_grupa skg ON kgp.kolegij_id = skg.kolegij_id AND kgp.grupa_id = skg.grupa_id
        JOIN student s ON skg.student_id = s.id
      WHERE s.email = $1
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
      [email]
    );
    
    res.json({
      success: true,
      termini: terminiQuery,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju rasporeda:", error.stack);
    return ERROR_CODE.DATABASE_ERROR(res);
  }
};

export {
  loginUser,
  getStudentTimetable,
};

import { queryDatabase } from "../models/pool.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";

const loginUser = async (req, res) => {
  const { email, userType } = req;
  const { password } = req.body;

  try {
    const result = await queryDatabase(
      `SELECT * FROM ${userType === `student` ? `student` : `profesor`} WHERE email = $1 AND lozinka = $2`,
      [email, password]
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
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const getTimetable = async (req, res) => {
  const {email, userType} = req;

  try{
    //!!!!!!!! COUNT popunjenost_kapacitet NE RADI SA STUDENTOM
    //TODO POPRAVIT
    const terminiQuery = await queryDatabase(
      `SELECT 
          t.dan_u_tjednu,
          t.pocetak,
          t.kraj,
          k.id AS kolegij_id,
          k.naziv AS kolegij_naziv,
          CONCAT(pr.ime, ' ', pr.prezime) AS profesor_ime,
          g.naziv AS grupa_naziv,
          p.naziv AS prostorija_naziv,
          COUNT(s.id)::int AS popunjenost_kapacitet,
          p.kapacitet AS prostorija_kapacitet
        FROM termin t
          JOIN kolegij_grupa_profesor kgp 
            ON t.kolegij_id = kgp.kolegij_id AND t.grupa_id = kgp.grupa_id
          JOIN profesor pr 
            ON kgp.profesor_id = pr.id
          JOIN kolegij k 
            ON t.kolegij_id = k.id
          JOIN grupa g 
            ON t.grupa_id = g.id
          JOIN prostorija p 
            ON t.prostorija_id = p.id
          ${
            userType === "profesor" ? `LEFT ` : ``
          }JOIN student_kolegij_grupa skg 
            ON kgp.kolegij_id = skg.kolegij_id AND kgp.grupa_id = skg.grupa_id
          ${
            userType === "profesor" ? `LEFT ` : ``
          }JOIN student s 
            ON skg.student_id = s.id
        WHERE ${userType === "student" ? `s` : `pr`}.email = $1
        GROUP BY 
          t.dan_u_tjednu, t.pocetak, t.kraj, k.id, k.naziv, pr.ime, pr.prezime, g.naziv, p.naziv, p.kapacitet
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
      userType,
      termini: terminiQuery,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju rasporeda:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const getAllGroups = async (req, res) => {
  const { email, userType } = req;
  const { id } = req.params;

  try {
    let kolegij_idNiz;
    let kolegijiQuery;

    if (id) {
      kolegij_idNiz = [+id];
    } else {
      if(userType == "student") {
        kolegijiQuery = await queryDatabase(
          `SELECT 
            k.id
          FROM student s
            JOIN student_kolegij_grupa skg
              ON s.id = skg.student_id
            JOIN kolegij k
              ON skg.kolegij_id = k.id
          WHERE s.email = $1`,
          [email]
        );
      }
      else if(userType == "profesor") {
        kolegijiQuery = await queryDatabase(
          `SELECT 
            k.id
          FROM profesor pr
            JOIN kolegij_grupa_profesor kgp
              ON kgp.profesor_id = pr.id
            JOIN kolegij k
              ON kgp.kolegij_id = k.id
          WHERE pr.email = $1`,
          [email]
        );
      }
    
      if (kolegijiQuery.length === 0) {
        return ERROR_CODE.RESOURCE_NOT_FOUND(res);
      }

      kolegij_idNiz = Array.from(new Set(kolegijiQuery.map((kolegij) => kolegij.id)));    
    }

    const grupeQuery = await queryDatabase(
      `SELECT 
        t.dan_u_tjednu,
        t.pocetak,
        t.kraj,
        k.id AS kolegij_id,
        k.naziv AS kolegij_naziv,
        CONCAT(pr.ime, ' ', pr.prezime) AS profesor_ime,
        g.naziv AS grupa_naziv,
        p.naziv AS prostorija_naziv,
        COUNT(s.id)::int AS popunjenost_kapacitet,
        p.kapacitet AS prostorija_kapacitet
      FROM termin t
        JOIN kolegij_grupa_profesor kgp 
          ON t.kolegij_id = kgp.kolegij_id AND t.grupa_id = kgp.grupa_id
        JOIN profesor pr
          ON kgp.profesor_id = pr.id
        JOIN kolegij k 
          ON t.kolegij_id = k.id
        JOIN grupa g 
          ON t.grupa_id = g.id
        JOIN prostorija p 
          ON t.prostorija_id = p.id
        LEFT JOIN student_kolegij_grupa skg 
          ON kgp.kolegij_id = skg.kolegij_id AND kgp.grupa_id = skg.grupa_id
        LEFT JOIN student s 
          ON skg.student_id = s.id
      WHERE k.id = ANY($1)
      GROUP BY 
          t.dan_u_tjednu, t.pocetak, t.kraj, k.id, k.naziv, pr.ime, pr.prezime, g.naziv, p.naziv, p.kapacitet
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
      [kolegij_idNiz]
    );

    res.json({
      success: true,
      grupe: grupeQuery,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju svih grupa:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const getToDo = async (req, res) => {
  const { email, userType } = req;

  try {
    const toDoQuery = await queryDatabase(
      `SELECT todo_zapis
      FROM ${userType === "student" ? `student` : `profesor`}
      WHERE email = $1`,
      [email]
    );

    res.json({
      success: true,
      grupe: toDoQuery,
    });
  } catch (error) {
    console.error("Greška pri ažuriranju TODO odjeljka:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
}

const updateToDo = async (req, res) => {
  const { email, userType } = req;
  const { noviZapis } = req.body;

  try {
    await queryDatabase(
      `UPDATE ${userType === "student" ? `student` : `profesor`}
      SET todo_zapis = $1
      WHERE email = $2`,
      [noviZapis, email]
    );

    res.status(200).json({ message: "Korisniku je ažuriran TODO odjeljak." });
  } catch (error) {
    console.error("Greška pri ažuriranju TODO odjeljka:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
}

export { loginUser, getTimetable, getAllGroups, getToDo, updateToDo };

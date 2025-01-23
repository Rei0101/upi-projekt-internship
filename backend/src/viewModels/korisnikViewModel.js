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


const changeGroup = async (req, res) => {
  const { student_email, kolegij_id, stara_grupa_id, nova_grupa_id } = req.body;

  try {
    console.log("Podaci primljeni u zahtjevu:", { student_email, kolegij_id, stara_grupa_id, nova_grupa_id });

    const studentResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [student_email]
    );

    if (studentResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student ne postoji.",
      });
    }
    const student_id = studentResult[0].id;

    const kolegijResult = await queryDatabase(
      "SELECT id FROM kolegij WHERE id = $1",
      [kolegij_id]
    );

    if (kolegijResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kolegij ne postoji.",
      });
    }

    const newGroupResult = await queryDatabase(
      `SELECT 1 
       FROM grupa 
       WHERE id = $1;`,
      [nova_grupa_id]
    );

    if (newGroupResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nova grupa ne postoji.",
      });
    }

    const studentGroupResult = await queryDatabase(
      "SELECT * FROM student_kolegij_grupa WHERE student_id = $1 AND kolegij_id = $2 AND grupa_id = $3",
      [student_id, kolegij_id, nova_grupa_id]
    );
    console.log("Rezultat upita za studenta u grupi:", studentGroupResult);

    if (studentGroupResult.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Student je već član ove grupe.",
      });
    }

    const updateResult = await queryDatabase(
      "UPDATE student_kolegij_grupa SET grupa_id = $1 WHERE student_id = $2 AND kolegij_id = $3 AND grupa_id = $4",
      [nova_grupa_id, student_id, kolegij_id, stara_grupa_id]
    );
    console.log("Rezultat ažuriranja grupe:", updateResult);

    if (updateResult.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Promjena grupe nije uspjela. Provjerite unesene podatke.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Grupa uspješno promijenjena.",
    });
  } catch (error) {
    console.error("Greška pri izmjeni grupe:", error);
    return res.status(500).json({
      success: false,
      message: "Došlo je do greške pri izmjeni grupe.",
    });
  }
};


const sendExchangeRequest = async (req, res) => {
  const { posiljatelj_email, primatelj_email, kolegij_id, stara_grupa_id, nova_grupa_id } = req.body;

  try {
    const senderResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [posiljatelj_email]
    );
    if (senderResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pošiljatelj ne postoji.",
      });
    }
    const posiljatelj_id = senderResult[0].id;

    const recipientResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [primatelj_email]
    );
    if (recipientResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Primatelj ne postoji.",
      });
    }
    const primatelj_id = recipientResult[0].id;


    const existingRequestsSender = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE posiljatelj_id = $1 AND status = 'Na čekanju'",
      [posiljatelj_id]
    );
    if (existingRequestsSender.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Pošiljatelj već ima zahtjev za razmjenu na čekanju.",
      });
    }

    const existingRequestsRecipient = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE primatelj_id = $1 AND status = 'Na čekanju'",
      [primatelj_id]
    );
    if (existingRequestsRecipient.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Primatelj već ima zahtjev za razmjenu na čekanju.",
      });
    }


    const newGroupResult = await queryDatabase(
      `SELECT 1 
       FROM grupa 
       WHERE id = $1;`,
      [nova_grupa_id]
    );

    if (newGroupResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nova grupa ne postoji.",
      });
    }

    const insertResult = await queryDatabase(
      `INSERT INTO zahtjev_za_razmjenu (posiljatelj_id, primatelj_id, kolegij_id, stara_grupa_id, nova_grupa_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [posiljatelj_id, primatelj_id, kolegij_id, stara_grupa_id, nova_grupa_id]
    );

    res.status(200).json({
      success: true,
      message: "Zahtjev za razmjenu je uspješno poslan.",
      requestId: insertResult[0].id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Došlo je do pogreške prilikom slanja zahtjeva za razmjenu.",
    });
  }
};



const getExchangeRequests = async (req, res) => {
  const { student_email } = req.body;

  try {
    const studentResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [student_email]
    );

    if (studentResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student ne postoji.",
      });
    }

    const student_id = studentResult[0].id;

    const exchangeRequests = await queryDatabase(
      `
      SELECT 
        z.id AS zahtjev_id,
        posiljatelj.ime || ' ' || posiljatelj.prezime AS posiljatelj_ime,
        k.naziv AS kolegij,
        sg.naziv AS stara_grupa,
        ng.naziv AS nova_grupa
      FROM zahtjev_za_razmjenu z
      JOIN student posiljatelj ON z.posiljatelj_id = posiljatelj.id
      JOIN kolegij k ON z.kolegij_id = k.id
      JOIN grupa sg ON z.stara_grupa_id = sg.id
      JOIN grupa ng ON z.nova_grupa_id = ng.id
      WHERE z.posiljatelj_id = $1 OR z.primatelj_id = $1
      `,
      [student_id]
    );

    if (exchangeRequests.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Nema zahtjeva za razmjenu.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Zahtjevi za razmjenu uspješno dohvaćeni.",
      data: exchangeRequests,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju zahtjeva za razmjenu:", error.stack);
    return res.status(500).json({
      success: false,
      message: "Došlo je do greške pri dohvaćanju zahtjeva za razmjenu.",
    });
  }
};


const handleExchangeResponse = async (req, res) => {
  const { primatelj_email, odluka } = req.body;

  try {
    const recipientResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [primatelj_email]
    );
    if (recipientResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Primatelj ne postoji.",
      });
    }
    const primatelj_id = recipientResult[0].id;

    const exchangeRequestResult = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE primatelj_id = $1 AND status = 'Na čekanju'",
      [primatelj_id]
    );
    if (exchangeRequestResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Nema zahtjeva za razmjenu na čekanju za ovog primatelja.",
      });
    }
    const zahtjev = exchangeRequestResult[0];

    if (odluka === "Accepted") {
      await queryDatabase(
        "UPDATE student_kolegij_grupa SET grupa_id = $1 WHERE student_id = $2 AND kolegij_id = $3",
        [zahtjev.nova_grupa_id, zahtjev.posiljatelj_id, zahtjev.kolegij_id]
      );

      await queryDatabase(
        "UPDATE student_kolegij_grupa SET grupa_id = $1 WHERE student_id = $2 AND kolegij_id = $3",
        [zahtjev.stara_grupa_id, zahtjev.primatelj_id, zahtjev.kolegij_id]
      );

      await queryDatabase(
        "UPDATE zahtjev_za_razmjenu SET status = 'Odobren' WHERE id = $1",
        [zahtjev.id]
      );

      return res.status(200).json({
        success: true,
        message: "Zahtjev za razmjenu je odobren i grupe su zamijenjene.",
      });
    } else if (odluka === "Declined") {
      await queryDatabase(
        "UPDATE zahtjev_za_razmjenu SET status = 'Odbijen' WHERE id = $1",
        [zahtjev.id]
      );

      return res.status(200).json({
        success: true,
        message: "Zahtjev za razmjenu je odbijen.",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Neispravna odluka. Dozvoljene vrijednosti su 'Odobren' ili 'Odbijen'.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Došlo je do pogreške prilikom obrade zahtjeva za razmjenu.",
    });
  }
};







export { loginUser, getTimetable, getAllGroups, updateToDo, changeGroup, sendExchangeRequest, getExchangeRequests, handleExchangeResponse };

import { queryDatabase } from "../models/pool.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";
import prevoditelj from "../utils/prijevodDana.js";
import provjeraUnosa from "../utils/provjeraUnosa.js";
import provjeraFormata from "../utils/provjeraFormata.js";

const loginUser = async (req, res) => {
  const { email, userType } = req;
  const { password } = req.body;

  try {
    const result = await queryDatabase(
      `SELECT * FROM ${
        userType === `student` ? `student` : `profesor`
      } WHERE email = $1 AND lozinka = $2`,
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
  const { email, userType } = req;

  try {
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
          ${userType === "profesor" ? `LEFT ` : ``}JOIN student s 
            ON skg.student_id = s.id
        WHERE ${userType === "student" ? `s` : `pr`}.email = $1
        GROUP BY 
          t.dan_u_tjednu, 
          t.pocetak, t.kraj, 
          k.id, k.naziv, 
          pr.ime, 
          pr.prezime, 
          g.naziv, 
          p.naziv, 
          p.kapacitet
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
      if (userType == "student") {
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
      } else if (userType == "profesor") {
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
        return ERROR_CODE.NOT_FOUND(
          res,
          "Nisu nađeni kolegiji sa zadanim parametrima."
        );
      }

      kolegij_idNiz = Array.from(
        new Set(kolegijiQuery.map((kolegij) => kolegij.id))
      );
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
        t.dan_u_tjednu, 
        t.pocetak, 
        t.kraj, k.id, 
        k.naziv, pr.ime, 
        pr.prezime, 
        g.naziv, 
        p.naziv, 
        p.kapacitet
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
      note: toDoQuery,
    });
  } catch (error) {
    console.error("Greška pri ažuriranju TODO odjeljka:", error.stack);
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
};

const getGroupAndParticipants = async (req, res) => {
  const { kolegij_naziv } = req.body;

  console.log("Query parametri:", req.body);

  console.log("Naziv kolegija:", kolegij_naziv);


  try {
    // Provjera postojanja kolegija po nazivu
    const kolegijResult = await queryDatabase(
      "SELECT id FROM kolegij WHERE naziv = $1",
      [kolegij_naziv]
    );
    if (kolegijResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Kolegij s danim nazivom ne postoji."
      );
    }

    const kolegij_id = kolegijResult[0].id;

    // Dohvati grupe povezane s kolegijem
    const grupaResult = await queryDatabase(
      `SELECT g.id AS grupa_id, g.naziv AS grupa_naziv
       FROM grupa g
       JOIN kolegij_grupa_profesor kgp ON g.id = kgp.grupa_id
       WHERE kgp.kolegij_id = $1`,
      [kolegij_id]
    );

    if (grupaResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Nema grupa povezanih s danim kolegijem."
      );
    }

    // Dohvati sudionike (studente) i njihove emailove za svaku grupu
    const groupsWithParticipants = await Promise.all(
      grupaResult.map(async (grupa) => {
        const studentiResult = await queryDatabase(
          `SELECT s.email
           FROM student s
           JOIN student_kolegij_grupa skg ON s.id = skg.student_id
           WHERE skg.grupa_id = $1 AND skg.kolegij_id = $2`,
          [grupa.grupa_id, kolegij_id]
        );

        return {
          grupa_naziv: grupa.grupa_naziv,
          sudionici: studentiResult.map((student) => student.email),
        };
      })
    );

    // Vraćanje rezultata
    res.status(200).json({
      success: true,
      data: groupsWithParticipants,
    });
  } catch (error) {
    console.error(error);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};




const changeGroup = async (req, res) => {
  const { student_email, kolegij_id, stara_grupa_id:promjena_stara, nova_grupa_id:promjena_nova } = req.body;
  const stara_grupa_id =
  promjena_stara === "Grupa A" ? 1 :
  promjena_stara === "Grupa B" ? 2 :
  promjena_stara === "Grupa C" ? 3 : null;

const nova_grupa_id =
  promjena_nova === "Grupa A" ? 1 :
  promjena_nova === "Grupa B" ? 2 :
  promjena_nova === "Grupa C" ? 3 : null;

  try {
    console.log("Podaci primljeni u zahtjevu:", {
      student_email,
      kolegij_id,
      stara_grupa_id,
      nova_grupa_id,
    });

    const studentResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [student_email]
    );

    if (studentResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Student s danim e-mail-om postoji.");
    }
    const student_id = studentResult[0].id;

    const kolegijResult = await queryDatabase(
      "SELECT id FROM kolegij WHERE id = $1",
      [kolegij_id]
    );

    if (kolegijResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Kolegij s danim id-om ne postoji.");
    }

    const newGroupResult = await queryDatabase(
      `SELECT 1 
       FROM grupa 
       WHERE id = $1;`,
      [nova_grupa_id]
    );

    if (newGroupResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Nova grupa ne postoji.");
    }

    const studentGroupResult = await queryDatabase(
      "SELECT * FROM student_kolegij_grupa WHERE student_id = $1 AND kolegij_id = $2 AND grupa_id = $3",
      [student_id, kolegij_id, nova_grupa_id]
    );
    console.log("Rezultat upita za studenta u grupi:", studentGroupResult);

    if (studentGroupResult.length > 0) {
      return ERROR_CODE.BAD_REQUEST(res, "Student je već član ove grupe.");
    }

    const updateResult = await queryDatabase(
      "UPDATE student_kolegij_grupa SET grupa_id = $1 WHERE student_id = $2 AND kolegij_id = $3 AND grupa_id = $4",
      [nova_grupa_id, student_id, kolegij_id, stara_grupa_id]
    );
    console.log("Rezultat ažuriranja grupe:", updateResult);

    if (updateResult.rowCount === 0) {
      return ERROR_CODE.BAD_REQUEST(
        res,
        "Promjena grupe nije uspjela. Provjerite unesene podatke."
      );
    }

    res.status(200).json({
      success: true,
      message: "Grupa uspješno promijenjena.",
    });
  } catch (error) {
    console.error("Greška pri izmjeni grupe:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const sendExchangeRequest = async (req, res) => {
  const {
    posiljatelj_email,
    primatelj_email,
    kolegij_id,
    stara_grupa_id,
    nova_grupa_id,
  } = req.body;

  try {
    const senderResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [posiljatelj_email]
    );
    if (senderResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Pošiljatelj s danim e-mail-om ne postoji."
      );
    }
    const posiljatelj_id = senderResult[0].id;

    const recipientResult = await queryDatabase(
      "SELECT id FROM student WHERE email = $1",
      [primatelj_email]
    );
    if (recipientResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Primatelj s danim e-mail-om ne postoji."
      );
    }
    const primatelj_id = recipientResult[0].id;

    const existingRequestsSender = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE posiljatelj_id = $1 AND status = 'Na čekanju'",
      [posiljatelj_id]
    );
    if (existingRequestsSender.length > 0) {
      return ERROR_CODE.BAD_REQUEST(
        res,
        "Pošiljatelj već ima zahtjev za razmjenu na čekanju."
      );
    }

    const existingRequestsRecipient = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE primatelj_id = $1 AND status = 'Na čekanju'",
      [primatelj_id]
    );
    if (existingRequestsRecipient.length > 0) {
      return ERROR_CODE.BAD_REQUEST(
        res,
        "Primatelj već ima zahtjev za razmjenu na čekanju."
      );
    }

    const newGroupResult = await queryDatabase(
      `SELECT 1 
       FROM grupa 
       WHERE id = $1;`,
      [nova_grupa_id]
    );

    if (newGroupResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Nova grupa ne postoji.");
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
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
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
      return ERROR_CODE.NOT_FOUND(res, "Student s danim e-mail-om ne postoji.");
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
        JOIN student posiljatelj ON 
          z.posiljatelj_id = posiljatelj.id
        JOIN kolegij k ON 
          z.kolegij_id = k.id
        JOIN grupa sg ON 
          z.stara_grupa_id = sg.id
        JOIN grupa ng ON 
          z.nova_grupa_id = ng.id
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
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
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
      return ERROR_CODE.NOT_FOUND(
        res,
        "Primatelj s danim e-mail-om ne postoji."
      );
    }
    const primatelj_id = recipientResult[0].id;

    const exchangeRequestResult = await queryDatabase(
      "SELECT * FROM zahtjev_za_razmjenu WHERE primatelj_id = $1 AND status = 'Na čekanju'",
      [primatelj_id]
    );
    if (exchangeRequestResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Nema zahtjeva za razmjenu na čekanju za ovog primatelja."
      );
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
      return ERROR_CODE.BAD_REQUEST(
        res,
        "Neispravna odluka. Dozvoljene vrijednosti su 'Odobren' ili 'Odbijen'."
      );
    }
  } catch (error) {
    console.error(error);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const getColloquium = async (req, res) => {
  const { email, userType } = req;

  try {
    const colloquiumQuery = await queryDatabase(
      `SELECT 
        ko.naziv AS naziv_Kolegija,
        g.naziv AS naziv_grupe,
        k.datum AS datum,
        k.dan_u_tjednu,
        k.pocetak AS pocetak,
        k.kraj AS kraj,
        CONCAT(pro.ime, ' ', pro.prezime) AS profesor_ime,
        p.naziv AS naziv_prostorije
      FROM kolokvij k
        JOIN kolegij ko ON
          k.kolegij_id = ko.id
        JOIN grupa g ON
          k.grupa_id = g.id
        JOIN prostorija p ON
          k.prostorija_id = p.id
        JOIN kolegij_grupa_profesor kgp ON
          g.id = kgp.grupa_id AND k.id = kgp.kolegij_id
        JOIN profesor pro ON
          kgp.profesor_id = pro.id
        JOIN student_kolegij_grupa skg ON
          ko.id = skg.kolegij_id AND g.id = skg.grupa_id
        JOIN student s ON
          skg.student_id = s.id
      WHERE ${userType === "student" ? `s` : `pro`}.email = $1
      GROUP BY 
        ko.naziv,
        g.naziv, 
        k.datum, 
        k.dan_u_tjednu, 
        k.pocetak, 
        k.kraj, 
        pro.ime, 
        pro.prezime, 
        p.naziv
      ORDER BY
        k.datum`,
      [email]
    );

    res.json({
      success: true,
      colloquiums: colloquiumQuery.map((kolokvij) => ({
        ...kolokvij,
        dan_u_tjednu: prevoditelj.naHrvatski(kolokvij.dan_u_tjednu),
      })),
    });

  } catch (error) {
    console.error("Greška pri dohvaćanju kolokvija:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};

const newColloquium = async (req, res) => {
  /**
   * Očekivani podaci trebaju biti strukturirani na sljedeći način:
   * {
   *    email: "marko.markovic@univ.com",
   *    naziv_kolegija: "Uvod u programsko inženjerstvo - Predavanja",
   *    naziv_grupe: "Grupa A",
   *    datum: "2025-03-15", //* (ovo je zadani format input polja tipa "date")
   *    pocetak: "08:15",
   *    kraj: "10:00",
   *    naziv_prostorije: "Dvorana 1"
   * }
   */

  const { email, naziv_kolegija, naziv_grupe, datum, pocetak, kraj, naziv_prostorije } = req.body;

  try {
    const emailResult = await queryDatabase(
      "SELECT id FROM profesor WHERE email = $1",
      [email]
    );
    
    if (emailResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(
        res,
        "Profesor s danim e-mail-om ne postoji."
      );
    }

    const [provjera_kolegija, provjera_grupe, provjera_prostorije] = await Promise.all([
      provjeraUnosa("kolegij", naziv_kolegija),
      provjeraUnosa("grupa", naziv_grupe),
      provjeraUnosa("prostorija", naziv_prostorije)
    ]);    

    if (provjera_kolegija[0] || provjera_grupe[0] || provjera_prostorije[0]) {
      return ERROR_CODE.NOT_FOUND(res);
    }

    const formatError = provjeraFormata(datum, pocetak, kraj);

    if (formatError) {
      return ERROR_CODE.BAD_REQUEST(res, formatError)
    }
    
    await queryDatabase(
      `INSERT INTO kolokvij (kolegij_id, grupa_id, datum, dan_u_tjednu, pocetak, kraj, prostorija_id) VALUES
      ($1, $2, $3, TO_CHAR($3::DATE, 'FMDay'), $4, $5, $6)`,
      [provjera_kolegija[1], provjera_grupe[1], datum, pocetak, kraj, provjera_prostorije[1]]
    );

    return res.status(200).json({
      success: true,
      message: "Dodan je novi kolokvij.",
    });
  } catch (error) {
    console.error(error);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
}

const changeSchedule = async (req, res) => {
  const { profesor_email, kolegij_naziv, dan_u_tjednu, pocetak, kraj } = req.body;

  try {
    console.log("Podaci primljeni u zahtjevu:", {
      profesor_email,
      kolegij_naziv,
      dan_u_tjednu,
      pocetak,
      kraj,
    });

    const profesorResult = await queryDatabase(
      "SELECT id FROM profesor WHERE email = $1",
      [profesor_email]
    );

    if (profesorResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Profesor s danim e-mail-om ne postoji.");
    }
    const profesor_id = profesorResult[0].id;

    const kolegijResult = await queryDatabase(
      "SELECT id FROM kolegij WHERE naziv = $1",
      [kolegij_naziv]
    );

    if (kolegijResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Kolegij s danim nazivom ne postoji.");
    }
    const kolegij_id = kolegijResult[0].id;

    const profesorKolegijResult = await queryDatabase(
      "SELECT 1 FROM kolegij_grupa_profesor WHERE kolegij_id = $1 AND profesor_id = $2",
      [kolegij_id, profesor_id]
    );

    if (profesorKolegijResult.length === 0) {
      return ERROR_CODE.NOT_AUTHORIZED(res, "Profesor ne predaje taj kolegij.");
    }

    const conflictCheck = await queryDatabase(
      `SELECT 1 FROM termin 
       WHERE kolegij_id IN (SELECT kolegij_id FROM kolegij_grupa_profesor WHERE profesor_id = $1)
       AND dan_u_tjednu = $2 
       AND ((pocetak, kraj) OVERLAPS ($3::TIME, $4::TIME))`,
      [profesor_id, dan_u_tjednu, pocetak, kraj]
    );

    if (conflictCheck.length > 0) {
      return ERROR_CODE.CONFLICT(res, "Termini se preklapaju. Promjena termina nije moguća.");
    }


    const terminResult = await queryDatabase(
      "SELECT id FROM termin WHERE kolegij_id = $1",
      [kolegij_id]
    );

    if (terminResult.length === 0) {
      return ERROR_CODE.NOT_FOUND(res, "Termin koji želite promijeniti ne postoji.");
    }
    const termin_id = terminResult[0].id;

    const updateResult = await queryDatabase(
      "UPDATE termin SET dan_u_tjednu = $1, pocetak = $2, kraj = $3 WHERE id = $4",
      [dan_u_tjednu, pocetak, kraj, termin_id]
    );

    if (updateResult.rowCount === 0) {
      return ERROR_CODE.BAD_REQUEST(res, "Promjena termina nije uspjela. Provjerite unesene podatke.");
    }

    res.status(200).json({
      success: true,
      message: "Termin uspješno promijenjen.",
    });
  } catch (error) {
    console.error("Greška pri izmjeni termina:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};


export {
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
};

import express, { json } from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import * as ERROR_CODE from "./errorKodovi.js";

const app = express();
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

// za ovo ćemo zasad samo lokalnu bazu koristit
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "ScheduleIT-DB",
  password: "internship",
  port: 5432,
});

const dozvoljeneTablice = [
  "chat",
  "grupa",
  "kolegij",
  "kolegij_grupa_profesor",
  "profesor",
  "prostorija",
  "student",
  "studij",
  "termin",
];

app.get("/", (req, res) => {
  res.json({
      "success": true,
      "message": "Dobrodošli na API za ScheduleIT."
  });
});

//-------------------------------------------------------

app.get("/:tablica", async (req, res) => {
  const {tablica} = req.params; // za izvući "tablica" parametar iz URL-a
  
  // provjeri je li dana tablica među dozvoljenima
  if (!dozvoljeneTablice.includes(tablica)) 
    return ERROR_CODE.INVALID_TABLE_NAME(res);

  try {
    const queryRes = await pool.query(`SELECT * FROM ${tablica}`);
    
    if (queryRes.rows.length === 0)
      return ERROR_CODE.RESOURCE_NOT_FOUND(res);

    res.json({
        success: true,
        data: queryRes.rows
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error.stack);

    return ERROR_CODE.DATABASE_ERROR(res);
  }
});

app.get("/:tablica/:id", async (req, res) => {
  const {id} = req.params; // za izvući "ID" parametar iz URL-a
  const {tablica} = req.params; // za izvući "tablica" parametar iz URL-a

  // provjeri je li dana tablica među dozvoljenima
  if (!dozvoljeneTablice.includes(tablica)) {
    return ERROR_CODE.INVALID_TABLE_NAME(res);
  }

  try {
    // način dohvaćanja pomoću $1 se koristi samo za vrijednosti, ne za imena tablica i stupaca
    // više je ovaj način preporučen kad se dohvaća preko upita zbog sigurnosti
    const queryRes = await pool.query(`SELECT * FROM ${tablica} WHERE id = $1`, [id]);
    
    if (queryRes.rows.length === 0)
      return ERROR_CODE.RESOURCE_NOT_FOUND(res);

    res.json({
        success: true,
        data: queryRes.rows[0]
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju podataka:", error.stack);

    return ERROR_CODE.DATABASE_ERROR(res);
  }
});

//----------------------Login---------------------------------

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Primljene informacije: ${username}, ${password}`); 

  try {
    const result = await pool.query(
      "SELECT * FROM student WHERE email = $1 AND lozinka = $2",
      [username, password]
    );

    console.log(result.rows);

    if (result.rows.length > 0) {
      res.status(200).json({ success: true });
    } else {
      return ERROR_CODE.NOT_AUTHORIZED(res);
    }
  } catch (error) {
    console.log(ERROR_CODE.RESOURCE_NOT_FOUND(res))
  }
});



const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server radi na portu http://localhost:${PORT}`);
});

// ovo samo služi za uredno gašenje baze kad smo gotovi sa njom
const shutdown = async () => {
  try {
    await pool.end();
    console.log("PostgreSQL pool zatvoren.");  
    server.close(() => {
      console.log("Server zatvoren.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Greška pri zatvaranju pool-a:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export {app, server};

//----------------------Termini---------------------------------

app.post("/raspored", async (req, res) => {
  const { email } = req.body;

  if (!email) { //ako email ne postoji, error
    return res.status(400).json({
      success: false,
      message: "Email nije poslan!",
    });
  }

  try {
    // Pronađi studenta na temelju emaila
    const studentQuery = await pool.query(
      "SELECT studij_id, grupa_id FROM student WHERE email = $1",
      [email]
    );

    if (studentQuery.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student nije pronađen!",
      });
    }

    const { studij_id, grupa_id } = studentQuery.rows[0];

    // Dohvati termine s detaljnim informacijama
    const terminiQuery = await pool.query(
      `
      SELECT 
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
        t.pocetak
      `,
      [studij_id, grupa_id]
    );

    
    res.status(200).json({
      success: true,
      termini: terminiQuery.rows,
    });
  } catch (error) {
    console.error("Greška:", error);
    res.status(500).json({
      success: false,
      message: "Greška pri dohvaćanju rasporeda!",
    });
  }
});


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
    // način dohvaćanja pomoću $1 se koristi samo za vrijednosti ne za imena tablica i stupaca
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

// ovo samo služi za uredno gašenje baze kad smo gotovi sa njom
const shutdown = () => {
  pool.end()
    .then(() => {
        console.log("PostgreSQL pool zatvoren");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Greška pri zatvaranju pool-a:", error);
        process.exit(1);
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server radi na portu http://localhost:${PORT}`);
});
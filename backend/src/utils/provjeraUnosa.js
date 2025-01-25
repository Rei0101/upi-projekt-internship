import { queryDatabase } from "../models/pool.js";

export default async function provjeraUnosa(naziv_tablice, vrijednost) {
  const result = await queryDatabase(
    `SELECT id FROM ${naziv_tablice} WHERE naziv = $1`,
    [vrijednost]
  );

  if (result.length === 0) {
    return [true, null];
  }
  return [false, result[0].id];
}

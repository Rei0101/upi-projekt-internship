import { queryDatabase } from "../models/pool.js";
import * as ERROR_CODE from "../utils/errorKodovi.js";

export default async function determineUserType(req, res, next) {
  const { email } = req.body;

  if (!email) {
    return ERROR_CODE.INVALID_EMAIL(res);
  }

  try {
    const userTypeQuery = await queryDatabase(
      `SELECT 
      CASE 
        WHEN EXISTS (SELECT 1 FROM student WHERE email = $1) THEN 'student'
        WHEN EXISTS (SELECT 1 FROM profesor WHERE email = $1) THEN 'profesor'
        ELSE NULL
      END AS user_type`,
      [email]
    );

    const userType = userTypeQuery[0]?.user_type;

    if (!userType) {
      return ERROR_CODE.RESOURCE_NOT_FOUND(res);
    }

    req.userType = userType;
    req.email = email;

    next();
  } catch (error) {
    console.error("Greška pri određivanju tipa korisnika:", error.stack);
    return ERROR_CODE.INTERNAL_SERVER_ERROR(res);
  }
};
import jwt from "jsonwebtoken";
import * as ERROR_CODE from "../utils/errorKodovi.js";

function authenticateToken(req, res, next) {
    

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return ERROR_CODE.NOT_AUTHORIZED(res, "Potreban je token.");
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    return ERROR_CODE.NOT_AUTHORIZED(res, "Potreban je token.");
  }
  jwt.verify(token, "kljuc-rasporeda", (err, decoded) => {
    
    if (err) {
      return ERROR_CODE.FORBIDDEN(res, "Token je istekao ili ne vrijedi.");
    }

    next();
  });
}

export { authenticateToken };

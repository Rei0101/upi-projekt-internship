function BAD_REQUEST(res, mes = "Unešeni podaci su neispravni.") {
  return res.status(400).json({
    success: false,
    errorCode: "BAD_REQUEST",
    message: mes,
  });
}

function NOT_AUTHORIZED(res, mes = "Nije autoriziran pristup ovom resursu.") {
  return res.status(401).json({
    success: false,
    errorCode: "NOT_AUTHORIZED",
    message: mes,
  });
}

function FORBIDDEN(res, mes = "Pristup odbijen.") {
  return res.status(403).json({
    success: false,
    errorCode: "FORBIDDEN",
    message: mes,
  });
}

function NOT_FOUND(res, mes = "Nisu pronađeni traženi resursi.") {
  return res.status(404).json({
    success: false,
    errorCode: "NOT_FOUND",
    message: mes,
  });
}

function CONFLICT(res, mes = "Došlo je do konflikta u zahtjevu.") {
  return res.status(409).json({
    success: false,
    errorCode: "CONFLICT",
    message: mes,
  });
}

function INTERNAL_SERVER_ERROR(res, mes = "Greška pri dohvaćanju podataka.") {
  return res.status(500).json({
    success: false,
    errorCode: "INTERNAL_SERVER_ERROR",
    message: mes,
  });
}

export {
  BAD_REQUEST,
  NOT_AUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
};

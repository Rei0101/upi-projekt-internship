function BAD_REQUEST(res, mes = "Unešeni podaci su neispravni.") {
  return res.status(400).json({
    success: false,
    errorCode: "INVALID_TABLE_NAME",
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

function NOT_FOUND(res, mes = "Nisu pronađeni traženi resursi.") {
  return res.status(404).json({
    success: false,
    errorCode: "RESOURCE_NOT_FOUND",
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
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  NOT_AUTHORIZED,
};

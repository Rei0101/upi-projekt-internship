function INVALID_TABLE_NAME(res) {
  return res.status(400).json({
    success: false,
    errorCode: "INVALID_TABLE_NAME",
    message: "Zadana tablica nije dozvoljena."
  });
}

function RESOURCE_NOT_FOUND(res) {
  return res.status(404).json({
    success: false,
    errorCode: "RESOURCE_NOT_FOUND",
    message: "U tablici nisu pronađeni traženi podaci."
  });
}

function DATABASE_ERROR(res) {
  return res.status(500).json({
    success: false,
    errorCode: "DATABASE_ERROR",
    message: "Greška pri dohvaćanju podataka.",
  });
}

export {
  INVALID_TABLE_NAME,
  RESOURCE_NOT_FOUND,
  DATABASE_ERROR
}
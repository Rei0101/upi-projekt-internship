export default function provjeraFormata(datum, pocetak, kraj) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datum) || isNaN(new Date(datum).getTime())) {
    return "Datum mora biti u formatu YYYY-MM-DD.";
  }
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(pocetak) || !timeRegex.test(kraj)) {
    return "Vrijeme mora biti u formatu HH:mm.";
  }
  return null;
}

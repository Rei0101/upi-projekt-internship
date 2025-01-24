const daniEngKey = {
    Monday: "Ponedjeljak",
    Tuesday: "Utorak",
    Wednesday: "Srijeda",
    Thursday: "Četvrtak",
    Friday: "Petak",
    Saturday: "Subota",
    Sunday: "Nedjelja",
}

const daniHrvKey = Object.fromEntries(
    Object.entries(daniEngKey).map(([engleski, hrvatski]) => [hrvatski, engleski])
);

const prevoditelj = {
    naHrvatski(dan) {
        return daniEngKey[dan] || "Netočan dan";
    },
    naEngleski(dan) {
        return daniHrvKey[dan] || "Netočan dan";
    }
}

export default prevoditelj;
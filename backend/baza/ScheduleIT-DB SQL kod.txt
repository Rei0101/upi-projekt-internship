-- Kreiranje baze za "Pametni raspored" naziva "ScheduleIT"

-- 1. Tablica za profesore
CREATE TABLE profesor (
    id SERIAL PRIMARY KEY,
    ime VARCHAR(100) NOT NULL,
    prezime VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    lozinka VARCHAR(255) NOT NULL
);

-- 2. Tablica za studije
CREATE TABLE studij (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(150) NOT NULL
);

-- 3. Tablica za kolegije
CREATE TABLE kolegij (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(150) NOT NULL,
    studij_id INT NOT NULL REFERENCES studij(id),
    profesor_id INT NOT NULL REFERENCES profesor(id)  -- Ovo je za predavanja, može biti NULL za m:n
);

-- 4. Tablica za grupe
CREATE TABLE grupa (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(50) NOT NULL
);

-- 5. Tablica M:N
CREATE TABLE kolegij_grupa_profesor (
    id SERIAL PRIMARY KEY,
    kolegij_id INT NOT NULL REFERENCES kolegij(id),
    grupa_id INT NOT NULL REFERENCES grupa(id),
    profesor_id INT NOT NULL REFERENCES profesor(id),
    UNIQUE(kolegij_id, grupa_id, profesor_id)  -- Osigurava jedinstvenost odnosa
);

-- 6. Tablica za studente
CREATE TABLE student (
    id SERIAL PRIMARY KEY,
    ime VARCHAR(100) NOT NULL,
    prezime VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    lozinka VARCHAR(255) NOT NULL,
    studij_id INT NOT NULL REFERENCES studij(id),
    grupa_id INT REFERENCES grupa(id)
);

-- 7. Tablica za prostorije
CREATE TABLE prostorija (
    id SERIAL PRIMARY KEY,
    naziv VARCHAR(150) NOT NULL
);

-- 8. Tablica za termin
CREATE TABLE termin (
    id SERIAL PRIMARY KEY,
    kolegij_id INT NOT NULL REFERENCES kolegij(id),
    grupa_id INT REFERENCES grupa(id),
    prostorija_id INT NOT NULL REFERENCES prostorija(id),
    pocetak TIMESTAMP NOT NULL,
    kraj TIMESTAMP NOT NULL
);

-- 9. Tablica za chat poruke
CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    posiljatelj_id INT NOT NULL, -- Može biti student ili profesor
    primatelj_id INT NOT NULL, -- Može biti student ili profesor
    poruka TEXT NOT NULL,
    vrijeme TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dodavanje ograničenja za referencijalni integritet i indekse
CREATE INDEX idx_termin_kolegij ON termin(kolegij_id);
CREATE INDEX idx_chat_posiljatelj ON chat(posiljatelj_id);
CREATE INDEX idx_chat_primatelj ON chat(primatelj_id);
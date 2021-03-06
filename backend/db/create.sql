CREATE TABLE Trainer (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Bildpfad TEXT NOT NULL,
    Vorname TEXT NOT NULL,
	Nachname TEXT NOT NULL,
	Fachgebiet TEXT NOT NULL,
    Beschreibung TEXT NOT NULL
);


CREATE TABLE Mitgliedschaft (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Name TEXT NOT NULL,
	Preis REAL NOT NULL DEFAULT 0.0,
    PreisAlt REAL NOT NULL DEFAULT 0.0,
    Einmalig REAL NOT NULL DEFAULT 0.0	
);

CREATE TABLE Mitglied (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Vorname TEXT NOT NULL,
	Nachname TEXT NOT NULL,
	Strasse TEXT NOT NULL,
    PLZ TEXT NOT NULL,
    Stadt TEXT NOT NULL,
    Geburtstag TEXT DEFAULT NULL,
	Telefon TEXT NOT NULL,
	Email TEXT NOT NULL,
    Registrierungszeitpunkt TEXT DEFAULT NULL,
    MitgliedschaftID INTEGER NOT NULL,
	CONSTRAINT fk_Mitglied1 FOREIGN KEY (MitgliedschaftID) REFERENCES Mitgliedschaft(ID)
);

CREATE TABLE Kurs (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Bildpfad TEXT NOT NULL,
    Name TEXT NOT NULL,
	TrainerID INTEGER NOT NULL,
    Beschreibung TEXT NOT NULL,
    CONSTRAINT fk_Kurs1 FOREIGN KEY (TrainerID) REFERENCES Trainer(ID)
);

CREATE TABLE Anmeldung (
	ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	Rhytmus INTEGER NOT NULL,
    MitgliedID INTEGER NOT NULL,
	KursID INTEGER NOT NULL,
    Token TEXT NOT NULL,
    Zeitpunkt TEXT DEFAULT NULL,
    CONSTRAINT fk_Anmeldung1 FOREIGN KEY (MitgliedID) REFERENCES Mitglied(ID),
    CONSTRAINT fk_Anmeldung2 FOREIGN KEY (KursID) REFERENCES Kurs(ID)
);

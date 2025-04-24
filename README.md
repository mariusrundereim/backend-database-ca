# Dyreadopsjon Database Prosjekt

Dette prosjektet er et backend-system for en dyreadopsjon-applikasjon som fokuserer på databasehåndtering med MySQL. Systemet håndterer autentisering, brukerroller og databaseoperasjoner. Applikasjonen er designet for å kjøre lokalt og krever MySQL Workbench for å fungere optimalt.

### Funksjoner

- Autentiseringssystem med brukerroller (medlem og admin)
- Database for dyr, brukere og adopsjonsinformasjon
- CRUD-operasjoner for dyr, arter og temperament
- Rollebasert tilgangskontroll

## Teknologier

- **Express.js**
- **MySQL**
- **Sequelize** - ORM (Object-Relational Mapping)
- **Passport.js**
- **EJS**
- **bcryptjs**
- **Express-session**

## Systemkrav

- Node.js (v14 eller nyere)
- MySQL Server (v8 eller nyere)
- MySQL Workbench

## Installasjon

Følg disse trinnene for å sette opp prosjektet lokalt:

1. Klone repositoriet:

   ```bash
   git clone https://github.com/mariusrundereim/backend-database-ca.git
   cd databaseproject
   ```

2. Installer avhengigheter:

   ```bash
   npm install
   ```

3. Opprett en `.env` fil i prosjektets rotmappe med følgende variabler:

   ```
   DB_HOST=localhost
   DB_USER=dabcaowner
   DB_PASSWORD=dabca1234
   DB_NAME=animal_adoption
   SESSION_SECRET=dinsessionhemmelighet
   ```

4. Opprett databasen og brukeren i MySQL Workbench:

   ```sql
   CREATE DATABASE animal_adoption;
   ```

5. Start applikasjonen:

   ```bash
   npm start
   ```

6. Åpne nettleseren og gå til `http://localhost:3000`

## DATABASEACCESS

```sql
-- Opprett en ny bruker med databaseeier-rettigheter
CREATE USER 'dabcaowner'@'localhost' IDENTIFIED BY 'dabca1234';
GRANT ALL PRIVILEGES ON animal_adoption.* TO 'dabcaowner'@'localhost';
FLUSH PRIVILEGES;
```

## Prosjektstruktur

Prosjektet følger en standard Express.js mappestruktur:

- `/bin` - Oppstartsskript
- `/config` - Konfigurasjonsfiler for database og Passport
- `/models` - Sequelize modeller
- `/routes` - Express ruter
- `/public` - Statiske filer (CSS, JavaScript, bilder)
- `/views` - EJS maler
- `/migrations` - Sequelize migrasjonsfiler
- `/seeders` - Data for initiell populering av databasen

## Funksjonalitet

### Navigasjon

Applikasjonen har fem hovedsider tilgjengelig via navigasjonsmenyen:

- **Hjem** - Landingsside
- **Dyr** - Viser alle dyr i databasen
- **Arter** - Administrasjon av dyrearter (kun for admin)
- **Temperament** - Administrasjon av temperament (kun for admin)
- **Logg inn** - For innlogging og registrering

### Brukerroller

- **Gjest** - Kan se dyr, men ikke adoptere
- **Medlem** - Kan se og adoptere tilgjengelige dyr
- **Admin** - Full tilgang, inkludert avbrytelse av adopsjoner, redigering av arter og temperament

### Databaser

Prosjektet bruker Sequelize ORM for å interagere med MySQL-databasen. Tabellstrukturen følger tredje normalform (3NF) og inkluderer relasjoner mellom dyr, arter, temperament, brukere og adopsjoner.

## API-endepunkter

### Dyr (animals.js)

- `GET /animals` - Hent alle dyr
- `POST /animals/adopt/:id` - Adopter et dyr (krever medlem-rolle)
- `POST /animals/cancel/:id` - Avbryt adopsjon (krever admin-rolle)

### Arter (species.js)

- `GET /species` - Hent alle arter
- `POST /species/add` - Legg til ny art (krever admin-rolle)
- `POST /species/update/:id` - Oppdater art (krever admin-rolle)

### Autentisering

- `GET /login` - Vis innloggingsside
- `POST /login` - Logg inn
- `GET /signup` - Vis registreringsside
- `POST /signup` - Registrer ny bruker
- `GET /logout` - Logg ut

## Bidrag

For å bidra til prosjektet, vennligst følg disse trinnene:

1. Fork repositoriet
2. Opprett en ny branch (`git checkout -b feature/din-funksjon`)
3. Commit endringene dine (`git commit -m 'Legg til funksjon'`)
4. Push til branch (`git push origin feature/din-funksjon`)
5. Åpne en Pull Request

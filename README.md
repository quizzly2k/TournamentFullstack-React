# Tournament Manager - Fullstack Application

En modernt webbapplikation för att hantera turneringar och spel med JWT-baserad autentisering.

## 📋 Innehålsförteckning

- [Översikt](#översikt)
- [Funktionalitet](#funktionalitet)
- [Teknikstack](#teknikstack)
- [Installation](#installation)
- [Konfiguration](#konfiguration)
- [API-dokumentation](#api-dokumentation)
- [Användning](#användning)
- [Arkitektur](#arkitektur)

## 🎯 Översikt

Tournament Manager är en fullstack-applikation som gör det möjligt för användare att:
- Skapa, läsa, uppdatera och ta bort turneringar
- Hantera spel inom turneringar
- Logga in med JWT-autentisering
- Få realtidsuppdateringar av data

Applikationen består av:
- **Backend**: ASP.NET Core REST API
- **Frontend**: Modern HTML/CSS/JavaScript-applikation
- **Databas**: Entity Framework Core med SQL Server

## ✨ Funktionalitet

### Autentisering & Säkerhet
- ✅ JWT-baserad autentisering
- ✅ Token-baserad auktorisering
- ✅ Automatisk logout vid utgånget token
- ✅ Rate limiting på API-anrop

### Turneringar
- ✅ **Hämta** alla turneringar med sökning
- ✅ **Skapa** nya turneringar
- ✅ **Uppdatera** befintliga turneringar
- ✅ **Ta bort** turneringar
- ✅ Visa antal spel per turnering

### Spel
- ✅ **Hämta** spel för en turnering
- ✅ **Skapa** nya spel
- ✅ **Uppdatera** befintliga spel
- ✅ **Ta bort** spel
- ✅ Verifiering att spel tillhör rätt turnering

## 🛠️ Teknikstack

### Backend
- **Framework**: ASP.NET Core 8.0
- **Databas**: SQL Server
- **ORM**: Entity Framework Core
- **Autentisering**: JWT (JSON Web Tokens)
- **Logging**: Microsoft.Extensions.Logging

### Frontend
- **HTML5**: Semantisk struktur
- **CSS3**: Modern responsive design
- **JavaScript (ES6+)**: Client-side logik
- **Fetch API**: API-kommunikation

### Utvecklingsverktyg
- **Version Control**: Git
- **IDE**: Visual Studio / Visual Studio Code
- **Runtime**: .NET 8.0

## 📦 Installation

### Förutsättningar
- .NET 8.0 SDK eller senare
- SQL Server 2019 eller senare (eller SQL Server Express)
- En modern webbläsare (Chrome, Firefox, Edge, Safari)

### Steg-för-steg Guide

#### 1. Klona Repository
```bash
git clone https://github.com/quizzly2k/TournamentFullstack.git
cd TournamentFullstack
```

#### 2. Installera & Konfigurera Backend

```bash
cd api
```

**Uppdatera databasmigration (om nödvändigt):**
```bash
dotnet ef migrations add YourMigrationName
dotnet ef database update
```

**Starta API-servern:**
```bash
dotnet run
```
API:et körs på: `http://localhost:5000`

#### 3. Öppna Frontend

Navigera till `frontend/index.html` i din webbläsare eller använd en lokal webbserver:

**Med Python:**
```bash
cd frontend
python -m http.server 8000
# Besök http://localhost:8000
```

**Med Live Server (VS Code):**
1. Installera "Live Server" extension
2. Högerklicka på `frontend/index.html` → "Open with Live Server"

## ⚙️ Konfiguration

### API-konfiguration (Frontend)

Redigera `frontend/js/api-client.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TOKEN_KEY: 'tournament_jwt_token'
};
```

### Databaskonfiguration (Backend)

Redigera `api/appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=TournamentDB;Trusted_Connection=true;"
  }
}
```

## 📚 API-dokumentation

### Tournaments Endpoints

#### GET `/api/tournaments`
Hämta alla turneringar

**Svar:**
```json
[
  {
    "id": 1,
    "title": "Spring Championship",
    "description": "Open tournament",
    "maxPlayers": 16,
    "date": "2026-03-02T12:00:00Z",
    "games": [...]
  }
]
```

#### POST `/api/tournaments`
Skapa ny turnering

**Request Body:**
```json
{
  "title": "Summer Tournament",
  "description": "Private tournament",
  "maxPlayers": 10,
  "date": "2026-06-15T18:00:00Z"
}
```

#### PUT `/api/tournaments/{id}`
Uppdatera turnering

#### DELETE `/api/tournaments/{id}`
Ta bort turnering

### Games Endpoints

#### GET `/api/tournaments/{tournamentId}/games`
Hämta alla spel i en turnering

#### POST `/api/tournaments/{tournamentId}/games`
Skapa nytt spel

**Request Body:**
```json
{
  "title": "Qualifying Match 1",
  "time": "2026-03-02T13:00:00Z",
  "tournamentId": 1
}
```

#### PUT `/api/tournaments/{tournamentId}/games/{id}`
Uppdatera spel

#### DELETE `/api/tournaments/{tournamentId}/games/{id}`
Ta bort spel

## 🎮 Användning

### Login
1. Öppna applikationen i webbläsaren
2. Ange användarnamn och lösenord
3. Klicka "Logga in"

### Hantera Turneringar
1. Klicka på "Turneringar" fliken
2. Fyll i formuläret och klicka "Lägg till turnering"
3. Se alla turneringar i listan
4. Använd "Redigera" eller "Ta bort" för att modifiera

### Hantera Spel
1. Klicka på "Spel" fliken
2. Välj en turnering från dropdown-menyn
3. Formuläret för att lägga till spel visas
4. Fyll i och klicka "Lägg till spel"
5. Se alla spel för turneringen

## 🏗️ Arkitektur

### Backend-struktur
```
api/
├── Controllers/
│   ├── TournamentsController.cs
│   └── GamesController.cs
├── Models/
│   ├── Tournament.cs
│   └── Game.cs
├── Services/
│   ├── TournamentService.cs
│   ├── GameService.cs
│   └── RateLimitingService.cs
└── Data/
    └── TournamentContext.cs
```

### Frontend-struktur
```
frontend/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── auth.js
    ├── api-client.js
    ├── tournaments.js
    └── games.js
```

## 🔒 Säkerhet

### JWT-tokens
- Tokens lagras i `localStorage`
- Tokens skickas i `Authorization`-headern
- Utgångna tokens resulterar i automatisk logout

### Input Validation
- Server-side validering på alla inputs
- HTML-escaping för att förhindra XSS-attacker
- Rate limiting för att förhindra abuse

## 👨‍💻 Autor

Tomas Hertzman

---

**Version**: 1.0.0

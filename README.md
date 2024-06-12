# Bachelor project for Team sykdom-i-familien. 
## Fork before continuing development.

---

# Vju - Frontend for dokumentvisning

|React versjon|2.0.5     | 
|-------------|----------|
|Node versjon | 16.18.76 |
| initalisert med | create-react-app |

Vju er et frontend-prosjekt designet for saksbehandlere for å hente og se dokumenter. Dette grensesnittet er kompatibelt med backend-tjenesten som er tilgjengelig på: [NAV-IT-SIF-bachelor-backend](https://github.com/Bad-chelor-ITPE3200/NAV-IT-SIF-bachelor-backend).

## Installasjon

1. Klon "main" grenen av repositoriet til din lokale maskin.
2. Åpne terminalen og naviger til rotkatalogen av prosjektet.
3. Installer avhengigheter ved å kjøre `npm install`.
4. Bytt "proxy" i package.json til: http://localhost:8080, om du ønsker å kjøre applikasjonen våres lokalt sammen med backenden.

## Kompatibilitet
Vju-frontenden er kompatibel med NAV-IT-SIF-bachelor-backend, og er spesielt tilpasset for bruk av saksbehandlere.

## Playground

Siden vi ikke har direkte tilgang på data, mocker vi alt. For testing av frontend-grensesnittet, kan følgende filterkombinasjoner brukes:
- **Standard brukerID: 11111111111**
- **Tilgjengelige filtere**
    - Status: Ferdigstilt
    - Fradato: 1. Desemeber 2023 - Tildato: 1. Mai 2024
    - Typen: Inngående - Tema: Syk
   
## Bruk

1. Klon backend-tjenesten: [NAV-IT-SIF-bachelor-backend](https://github.com/Bad-chelor-ITPE3200/NAV-IT-SIF-bachelor-backend).
2. Start **VjuLocalApplication** under test-mappen.
3. Start frontend-applikasjonen ved å kjøre `npm start` i terminalen.
4. Åpne nettleseren og gå til `http://localhost:3000` for å bruke Vju-grensesnittet.
5. For å kjøre en statisk server så kan du følge disse stegene: 
    5.1: start med å bygge prosjektet: `npm run build`
    5.2: vi har serve installert så denne kan testes med `npx serve -S build`
    
## Docker

For å bygge en dockercontainer kalt "frontend" så kjører du kommandoen `docker build -t frontend .` i roten av prosjektet.

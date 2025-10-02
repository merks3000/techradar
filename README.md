# WEBLAB TechRadar

Next.js Webapplikation für ein TechRadar

Auf Vercel deployte Webapplikation: <https://techradar-vercel.vercel.app>

## Beschreibung

Dies ist das WEBLAB Projekt von Mirco Stadelmann für die Blockwoche.
Dabei wird die Aufgabenstellung [Technologieradar](https://github.com/web-programming-lab/web-programming-lab-projekt/blob/95134d1041bce5140a3e29f034154216fcffd7ff/Technologie-Radar.md) ohne Anpassungen am Scope umgesetzt.

## Technologiestack

Ich habe mich für folgenden Stack entschieden :
- react (Frontend) (und am Ende auch Next.js)
- Next.js (Backend)

## weitere Dokumente

- [Dokumentation](https://github.com/merks3000/techradar/blob/main/DOKU.md)
- [Reflexion](https://github.com/merks3000/techradar/blob/main/REFLEXION.md)
- [Journal](https://github.com/merks3000/techradar/blob/main/JOURNAL.md)


## Voraussetzungen
- Node **≥24**
- npm
- Docker für Postgres (Testing)

## Setup
```bash
# clone repo
cd <techradar>
npm i

# run tests
docker run --name pg-test -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=techradar_test -p 5432:5432 -d postgres:16
npm run test
npm run e2e

# run app
mv .env.example .env.local
npm run dev

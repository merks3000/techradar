# WEBLAB TechRadar

Next.js Webapplikation für ein TechRadar

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

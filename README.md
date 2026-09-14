# Steady

Modern medication tracking mobile web app.

## Stack
- **Frontend:** React + TypeScript + Vite
- **Backend:** ASP.NET Core 8 Minimal API
- **Database:** MongoDB
- **Icons/UI:** Lucide React + responsive custom CSS

## Run locally

### Backend + MongoDB
```bash
docker compose up --build
```
Or run MongoDB locally and start the API:
```bash
cd backend/Steady.Api
dotnet restore
dotnet run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

If the API runs on another URL, set `VITE_API_URL` before starting the frontend.

## Features
- Daily medication dashboard
- Dose completion tracking
- Add/delete medications
- Progress and streak UI
- Responsive mobile-first design
- Smooth transitions and bottom navigation
- MongoDB persistence through the .NET API
- Swagger API documentation

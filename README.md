# Calculator App

A minimal full-stack calculator application with a React + Vite frontend and a FastAPI backend.

## Project structure

- `backend/`
  - `requirements.txt` — Python dependencies
  - `app/main.py` — FastAPI application entry
  - `app/api/calculator.py` — calculator route definitions
  - `app/controllers/calculator_controller.py` — controller logic for calculator requests
  - `app/services/calculator_service.py` — backend expression evaluator
  - `app/models/calculator_model.py` — request/response models
- `frontend/`
  - `package.json` — frontend dependencies and scripts
  - `vite.config.js` — Vite configuration
  - `src/` — React application source
  - `src/components/Calculator.jsx` — main UI and calculator logic
  - `src/services/calculatorService.js` — frontend evaluation and backend integration

## Features

- Basic arithmetic calculator UI
- Use of backend route `POST /calculate`
- Local evaluation fallback when the backend is unavailable
- Clickable history panel
- Repeated `=` behavior
- Keyboard input support

## Prerequisites

- Node.js and npm
- Python 3.11+ (or a compatible Python 3 version)

## Setup

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Run the app

### Start backend

From the project root:

```bash
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8080
```

### Start frontend

```bash
cd frontend
npm run dev
```

### Open in browser

Visit `http://localhost:5173`

## API endpoints

- `GET /health` — service health check
- `POST /calculate` — evaluate arithmetic expressions

## Notes

- Frontend currently attempts to contact the backend at `http://127.0.0.1:8080/calculate` and falls back to local evaluation when the backend is unreachable.
- The UI includes a history toggle and a restoreable history list.

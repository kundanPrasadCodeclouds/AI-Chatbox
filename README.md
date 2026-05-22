# AI Chatbox

A full-stack AI chatbox built with React, Vite, Node.js, Express, and the free Hugging Face Inference API.

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── routes
│   │   ├── services
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend
    ├── src
    │   ├── components
    │   ├── config
    │   ├── services
    │   ├── styles
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Prerequisites

- Node.js 20 or newer
- A free Hugging Face access token

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Add your Hugging Face token to `backend/.env`:

```env
HUGGING_FACE_API_TOKEN=your_hugging_face_token_here
```

Start the backend:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

To debug Hugging Face setup step by step:

```bash
npm run doctor:hf
```

This checks the local env shape, masks the token, validates the token with Hugging Face, and sends one small model request.

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API

### `POST /api/chat`

Request:

```json
{
  "message": "Explain React hooks in simple terms."
}
```

Response:

```json
{
  "reply": "React hooks let function components use state and lifecycle behavior..."
}
```

## Production Build

```bash
cd frontend
npm run build
```

```bash
cd backend
npm start
```

## Notes

- The app uses Hugging Face's current router API with the free `hf-inference` provider model `katanemo/Arch-Router-1.5B:hf-inference`.
- The free Inference API can occasionally return loading, rate limit, or availability errors. The UI shows friendly fallback messages for those cases.
- Keep `.env` files private. Commit only `.env.example`.

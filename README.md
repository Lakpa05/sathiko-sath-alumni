# SathiKo Sath Alumni

Full-stack alumni platform using Vue 3, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose and JWT.

## Structure
- `frontend/` Vue public site + admin dashboard
- `backend/` Express REST API

## Run
### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Set `MONGODB_URI` and `JWT_SECRET` in `backend/.env`.

The frontend expects the API at `http://localhost:5000/api`.

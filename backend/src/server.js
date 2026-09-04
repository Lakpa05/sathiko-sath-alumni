import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import alumniRoutes from './routes/alumni.js';
import eventRoutes from './routes/events.js';
import newsRoutes from './routes/news.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();
const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.get('/', (req, res) => res.json({
  message: 'SathiKo Sath Alumni API is running',
  health: '/api/health'
}));
app.get('/api', (req, res) => res.json({
  message: 'SathiKo Sath Alumni API is running',
  health: '/api/health'
}));
app.get('/api/health', (req, res) => res.json({ ok: true, service: 'SathiKo Sath Alumni API' }));
app.use('/api/auth', authRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(port, () => console.log(`API running on http://localhost:${port}`));
});

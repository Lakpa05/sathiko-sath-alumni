import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: admin._id, name: admin.name, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (e) { next(e); }
});

router.post('/seed-admin', async (req, res, next) => {
  try {
    const exists = await Admin.findOne({ email: req.body.email });
    if (exists) return res.status(409).json({ message: 'Admin already exists' });
    const password = await bcrypt.hash(req.body.password, 12);
    const admin = await Admin.create({ name: req.body.name, email: req.body.email, password, role: 'superadmin' });
    res.status(201).json({ message: 'Admin created', id: admin._id });
  } catch (e) { next(e); }
});

export default router;

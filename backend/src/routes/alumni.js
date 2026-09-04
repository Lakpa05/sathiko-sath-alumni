import { Router } from 'express';
import Alumni from '../models/Alumni.js';
import { auth, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req,res,next) => {
  try {
    const { search, batch, country, status } = req.query;
    const q = {};
    if (search) q.$or = [{firstName:new RegExp(search,'i')},{lastName:new RegExp(search,'i')},{profession:new RegExp(search,'i')}];
    if (batch) q.batch = batch;
    if (country) q.country = country;
    if (status) q.status = status; else q.status = 'approved';
    res.json(await Alumni.find(q).sort({createdAt:-1}));
  } catch(e){next(e)}
});

router.post('/', async (req,res,next) => {
  try { res.status(201).json(await Alumni.create(req.body)); } catch(e){next(e)}
});

router.get('/admin/all', auth, adminOnly, async (req,res,next)=>{
  try { res.json(await Alumni.find().sort({createdAt:-1})); } catch(e){next(e)}
});

router.patch('/:id/status', auth, adminOnly, async (req,res,next)=>{
  try { res.json(await Alumni.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})); } catch(e){next(e)}
});

router.put('/:id', auth, adminOnly, async (req,res,next)=>{
  try { res.json(await Alumni.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})); } catch(e){next(e)}
});

router.delete('/:id', auth, adminOnly, async (req,res,next)=>{
  try { await Alumni.findByIdAndDelete(req.params.id); res.json({message:'Deleted'}); } catch(e){next(e)}
});

export default router;

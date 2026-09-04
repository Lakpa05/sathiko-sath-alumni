import { Router } from 'express';
import Event from '../models/Event.js';
import { auth, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async(req,res,next)=>{try{res.json(await Event.find({status:'published'}).sort({date:1}))}catch(e){next(e)}});
router.post('/',auth,adminOnly,async(req,res,next)=>{try{res.status(201).json(await Event.create(req.body))}catch(e){next(e)}});
router.put('/:id',auth,adminOnly,async(req,res,next)=>{try{res.json(await Event.findByIdAndUpdate(req.params.id,req.body,{new:true}))}catch(e){next(e)}});
router.delete('/:id',auth,adminOnly,async(req,res,next)=>{try{await Event.findByIdAndDelete(req.params.id);res.json({message:'Deleted'})}catch(e){next(e)}});
export default router;

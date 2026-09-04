import { Router } from 'express';
import News from '../models/News.js';
import { auth, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', async(req,res,next)=>{try{res.json(await News.find({status:'published'}).sort({createdAt:-1}))}catch(e){next(e)}});
router.post('/',auth,adminOnly,async(req,res,next)=>{try{res.status(201).json(await News.create(req.body))}catch(e){next(e)}});
router.put('/:id',auth,adminOnly,async(req,res,next)=>{try{res.json(await News.findByIdAndUpdate(req.params.id,req.body,{new:true}))}catch(e){next(e)}});
router.delete('/:id',auth,adminOnly,async(req,res,next)=>{try{await News.findByIdAndDelete(req.params.id);res.json({message:'Deleted'})}catch(e){next(e)}});
export default router;

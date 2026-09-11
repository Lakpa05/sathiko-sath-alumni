import { Router } from 'express';
import Event from '../models/Event.js';
import { auth, adminOnly } from '../middleware/auth.js';
import multer from 'multer';
const router = Router();
const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 1.5 * 1024 * 1024 },
	fileFilter: (req, file, callback) => callback(null, file.mimetype.startsWith('image/'))
});
router.get('/', async(req,res,next)=>{try{res.json(await Event.find({status:'published'})
	.select('title date time venue description image')
	.sort({date:1})
	.limit(50)
	.lean())}catch(e){next(e)}});
router.post('/',auth,adminOnly,upload.single('image'),async(req,res,next)=>{
	try {
		const eventData = { ...req.body };
		if (req.file) {
			eventData.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
		} else if (eventData.imageUrl) {
			eventData.image = eventData.imageUrl.trim();
		}
		delete eventData.imageUrl;
		res.status(201).json(await Event.create(eventData));
	} catch(e) { next(e); }
});
router.put('/:id',auth,adminOnly,async(req,res,next)=>{try{res.json(await Event.findByIdAndUpdate(req.params.id,req.body,{new:true}))}catch(e){next(e)}});
router.delete('/:id',auth,adminOnly,async(req,res,next)=>{try{await Event.findByIdAndDelete(req.params.id);res.json({message:'Deleted'})}catch(e){next(e)}});
export default router;

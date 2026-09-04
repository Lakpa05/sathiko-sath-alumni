import { Router } from 'express';
import Alumni from '../models/Alumni.js';
import Event from '../models/Event.js';
import News from '../models/News.js';
import { auth, adminOnly } from '../middleware/auth.js';
const router=Router();
router.get('/stats',auth,adminOnly,async(req,res,next)=>{
 try {
  const [totalAlumni,pendingAlumni,totalEvents,totalNews]=await Promise.all([
   Alumni.countDocuments({status:'approved'}), Alumni.countDocuments({status:'pending'}),
   Event.countDocuments(), News.countDocuments()
  ]);
  res.json({totalAlumni,pendingAlumni,totalEvents,totalNews});
 } catch(e){next(e)}
});
export default router;

import {Router} from 'express';
import {getStores} from '../controllers/storeController.js';
import {authenticate} from '../middleware/authMiddleware.js';
const router=Router();
router.get('/',authenticate,getStores);
export default router;
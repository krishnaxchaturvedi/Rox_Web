import {Router} from 'express';
import {authenticate} from '../middleware/authMiddleware.js';
import {allowRoles} from '../middleware/roleMiddleware.js';
import {dashboard} from '../controllers/ownerController.js';
const router=Router();
router.get('/dashboard',authenticate,allowRoles('OWNER'),dashboard);
export default router;
import {Router} from 'express';
import {saveRating} from '../controllers/ratingController.js';
import {authenticate} from '../middleware/authMiddleware.js';
import {allowRoles} from '../middleware/roleMiddleware.js';
const router=Router();
router.post('/',authenticate,allowRoles('USER'),saveRating);
export default router;
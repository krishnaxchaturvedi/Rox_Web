import {Router}from'express';
import {saveRating,getMyRating}from'../controllers/ratingController.js';
import {authenticate}from'../middleware/authMiddleware.js';
import {allowRoles}from'../middleware/roleMiddleware.js';
const router=Router();
router.use(authenticate,allowRoles('USER'));
router.get('/:storeId/mine',getMyRating);
router.post('/',saveRating);
export default router;
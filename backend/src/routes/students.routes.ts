import { Router } from 'express';
import { getActionCenter } from '../controllers/students.controller';

const router = Router();

router.get('/:id/action-center', getActionCenter);

export default router;
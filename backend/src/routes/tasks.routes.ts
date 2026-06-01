import { Router } from 'express';
import { updateTaskStatus } from '../controllers/tasks.controller';

const router = Router();

router.patch('/:taskId/status', updateTaskStatus);

export default router;
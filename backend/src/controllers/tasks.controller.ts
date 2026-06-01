import { Request, Response } from 'express';
import { z } from 'zod';
import { TaskService } from '../services/tasks.service';
import { Task } from '../types';

const statusSchema = z.enum(['todo', 'in_progress', 'completed']);

export const updateTaskStatus = (req: Request, res: Response<Task | { error: string }>): void => {
  const taskId = req.params.taskId as string;
  
  const parsedStatus = statusSchema.safeParse(req.body.status);
  
  if (!parsedStatus.success) {
    res.status(400).json({
      error: `Invalid status. Must be one of: todo, in_progress, completed`
    });
    return;
  }

  const task = TaskService.updateTaskStatus(taskId, parsedStatus.data);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json(task);
};
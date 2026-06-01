import { Request, Response } from 'express';
import { StudentService } from '../services/students.service';
import { ActionCenterResponse } from '../types';

export const getActionCenter = (req: Request, res: Response<ActionCenterResponse | { error: string }>): void => {
  const id = req.params.id as string;

  const response = StudentService.getActionCenter(id);
  if (!response) {
    res.status(404).json({ error: 'Student not found' });
    return;
  }

  res.json(response);
};
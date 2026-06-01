import { tasks } from '../data';
import { Task } from '../types';

export class TaskService {
  static updateTaskStatus(taskId: string, status: Task['status']): Task | null {
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
      return null;
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    return task;
  }
}

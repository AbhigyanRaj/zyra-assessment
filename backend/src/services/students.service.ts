import { students, tasks, messages } from '../data';
import { ActionCenterResponse, Student } from '../types';

export class StudentService {
  static getActionCenter(studentId: string): ActionCenterResponse | null {
    const student = students.find(s => s.id === studentId);
    if (!student) {
      return null;
    }

    const studentTasks = tasks.filter(t => t.studentId === studentId);
    const studentMessages = messages.filter(m => m.studentId === studentId);

    const unreadCount = studentMessages.filter(m => !m.read).length;
    const urgentTaskCount = studentTasks.filter(t =>
      t.priority === 'urgent' && t.status !== 'completed'
    ).length;

    return {
      student,
      tasks: studentTasks,
      messages: studentMessages,
      unreadCount,
      urgentTaskCount,
    };
  }
}

export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: 'active' | 'at_risk';
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  studentId: string;
  from: string;
  subject: string;
  preview: string;
  read: boolean;
  receivedAt: string;
}

export interface ActionCenterResponse {
  student: Student;
  tasks: Task[];
  messages: Message[];
  unreadCount: number;
  urgentTaskCount: number;
}
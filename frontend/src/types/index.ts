export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  gpa: number;
  counselorId: string;
  enrollmentStatus: 'active' | 'at_risk' | 'on_leave';
}

export interface Task {
  id: string;
  studentId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  studentId: string;
  counselorId: string;
  content?: string;
  preview?: string;
  subject?: string;
  from?: string;
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

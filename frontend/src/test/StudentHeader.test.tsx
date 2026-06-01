import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StudentHeader } from '../components/action-center/StudentHeader';
import type { Student } from '../types';

const mockStudent: Student = {
  id: 'stu_test',
  name: 'Test Student',
  email: 'test@school.edu',
  grade: 10,
  gpa: 3.5,
  counselorId: 'csl_001',
  enrollmentStatus: 'at_risk',
};

describe('StudentHeader Component', () => {
  it('renders student name, GPA, and grade correctly', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={0} unreadCount={0} />);
    
    expect(screen.getByText('Test Student')).toBeInTheDocument();
    
    // Check multiple occurrences of GPA and Grade (mobile + desktop variants)
    const grades = screen.getAllByText('10');
    expect(grades.length).toBeGreaterThan(0);
    
    const gpas = screen.getAllByText('3.5');
    expect(gpas.length).toBeGreaterThan(0);
  });

  it('renders the correct "At Risk" badge based on enrollmentStatus', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={0} unreadCount={0} />);
    
    const badge = screen.getByText('At Risk');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-red-600');
  });

  it('renders the correct "Active" badge when enrollmentStatus is active', () => {
    const activeStudent = { ...mockStudent, enrollmentStatus: 'active' as const };
    render(<StudentHeader student={activeStudent} urgentTaskCount={0} unreadCount={0} />);
    
    const badge = screen.getByText('Active');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('text-emerald-600');
  });

  it('displays the urgent tasks alert when urgentTaskCount > 0', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={3} unreadCount={0} />);
    
    expect(screen.getByText('3 urgent')).toBeInTheDocument();
    expect(screen.getByText('need attention')).toBeInTheDocument();
  });

  it('hides the urgent tasks alert when urgentTaskCount is 0', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={0} unreadCount={0} />);
    
    expect(screen.queryByText(/urgent/i)).not.toBeInTheDocument();
  });

  it('displays the unread messages count when unreadCount > 0', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={0} unreadCount={5} />);
    
    const unreadNum = screen.getByText('5');
    const unreadLabel = screen.getByText('Unread');
    
    expect(unreadNum).toBeInTheDocument();
    expect(unreadLabel).toBeInTheDocument();
  });

  it('hides the unread messages count when unreadCount is 0', () => {
    render(<StudentHeader student={mockStudent} urgentTaskCount={0} unreadCount={0} />);
    
    expect(screen.queryByText('Unread')).not.toBeInTheDocument();
  });
});

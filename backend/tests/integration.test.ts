import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app';

describe('Backend API Integration Tests', () => {
  
  describe('GET /students/:id/action-center', () => {
    it('should return a 200 response with correct student data and metrics for a valid student', async () => {
      const response = await request(app).get('/students/stu_001/action-center');
      
      expect(response.status).toBe(200);
      
      // Verify Observability Headers
      expect(response.headers['x-request-id']).toBeDefined();
      
      // Verify Response Structure
      expect(response.body).toHaveProperty('student');
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('messages');
      expect(response.body).toHaveProperty('unreadCount');
      expect(response.body).toHaveProperty('urgentTaskCount');
      
      // Verify Student
      expect(response.body.student.id).toBe('stu_001');
      expect(response.body.student.name).toBe('Maya Patel');
      
      // Verify Computed Metrics
      expect(typeof response.body.unreadCount).toBe('number');
      expect(typeof response.body.urgentTaskCount).toBe('number');
    });
    
    it('should return a 404 response for an invalid student ID', async () => {
      const response = await request(app).get('/students/invalid_id_123/action-center');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Student not found');
      expect(response.headers['x-request-id']).toBeDefined();
    });
  });

  describe('PATCH /tasks/:taskId/status', () => {
    it('should successfully update task status for a valid request', async () => {
      const response = await request(app)
        .patch('/tasks/tsk_001/status')
        .send({ status: 'completed' });
        
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
      expect(response.headers['x-request-id']).toBeDefined();
    });
    
    it('should return 400 Bad Request if status is invalid', async () => {
      const response = await request(app)
        .patch('/tasks/tsk_001/status')
        .send({ status: 'not_a_valid_status' });
        
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Invalid status');
      expect(response.headers['x-request-id']).toBeDefined();
    });
    
    it('should return 404 if the task does not exist', async () => {
      const response = await request(app)
        .patch('/tasks/invalid_task_id/status')
        .send({ status: 'in_progress' });
        
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
      expect(response.headers['x-request-id']).toBeDefined();
    });
  });
});

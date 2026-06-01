import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './client';
import type { ActionCenterResponse, Task } from '../types';
import { toast } from 'sonner';

// Fetch Action Center Data
export const useActionCenter = (studentId: string) => {
  return useQuery({
    queryKey: ['action-center', studentId],
    queryFn: async () => {
      const response = await api.get<ActionCenterResponse>(`/students/${studentId}/action-center`);
      return response.data;
    },
    retry: 1, // Don't retry too many times on 404s
  });
};

// Update Task Status (Optimistic UI)
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: Task['status'] }) => {
      const response = await api.patch<Task>(`/tasks/${taskId}/status`, { status });
      return response.data;
    },
    // When mutate is called:
    onMutate: async ({ taskId, status }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['action-center'] });

      // Snapshot the previous value
      const previousData = queryClient.getQueriesData<ActionCenterResponse>({ queryKey: ['action-center'] });

      // Optimistically update the cache for all action-center queries
      queryClient.setQueriesData({ queryKey: ['action-center'] }, (old: ActionCenterResponse | undefined) => {
        if (!old) return old;
        
        const updatedTasks = old.tasks.map(t => 
          t.id === taskId ? { ...t, status, updatedAt: new Date().toISOString() } : t
        );

        // Recompute urgent count
        const urgentTaskCount = updatedTasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;

        return {
          ...old,
          tasks: updatedTasks,
          urgentTaskCount,
        };
      });

      // Return a context object with the snapshotted value
      return { previousData };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to update task status');
    },
    // Always refetch after error or success to ensure backend sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['action-center'] });
    },
    onSuccess: (_, variables) => {
      toast.success(`Task marked as ${variables.status.replace('_', ' ')}`);
    }
  });
};

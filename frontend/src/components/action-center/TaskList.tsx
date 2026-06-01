import type { Task } from '../../types';
import { useUIStore } from '../../store/uiStore';
import { TaskItem } from './TaskItem';
import { cn } from '../../lib/utils';
import { ListTodo, CheckCircle2 } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { taskFilter, setTaskFilter } = useUIStore();

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === 'all') return true;
    if (taskFilter === 'urgent') return task.priority === 'urgent' && task.status !== 'completed';
    return task.status === taskFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Urgent first, then by due date
    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
    if (a.priority !== 'urgent' && b.priority === 'urgent') return 1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const filters: { label: string; value: typeof taskFilter; count?: number }[] = [
    { label: 'All', value: 'all', count: tasks.length },
    { label: 'Urgent', value: 'urgent', count: tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length },
    { label: 'To Do', value: 'todo', count: tasks.filter(t => t.status === 'todo').length },
    { label: 'Done', value: 'completed', count: tasks.filter(t => t.status === 'completed').length },
  ];

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover-lift h-full flex flex-col">

      {/* Header row */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Action Items</h2>
        </div>

        {/* Segmented filter tabs — Zyra indigo active state */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg overflow-x-auto w-full sm:w-auto scrollbar-hide">
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setTaskFilter(filter.value)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                taskFilter === filter.value
                  ? 'bg-brand text-brand-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-card'
              )}
            >
              {filter.label}
              {typeof filter.count === 'number' && filter.count > 0 && (
                <span className={cn(
                  'ml-1.5 text-[10px] font-semibold tabular-nums',
                  taskFilter === filter.value ? 'text-brand-foreground/70' : 'text-muted-foreground'
                )}>
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Task list body */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CheckCircle2 className="h-8 w-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">All clear here</p>
            <p className="text-xs mt-1">No tasks match this filter</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {sortedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

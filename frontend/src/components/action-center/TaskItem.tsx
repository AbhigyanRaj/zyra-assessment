import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Task } from '../../types';
import { useUpdateTaskStatus } from '../../api/queries';
import { cn } from '../../lib/utils';

interface TaskItemProps {
  task: Task;
}

const PRIORITY_LABEL: Record<string, string> = {
  urgent: 'Urgent',
  high:   'High',
  medium: 'Medium',
  low:    'Low',
};

export function TaskItem({ task }: TaskItemProps) {
  const { mutate: updateStatus, isPending } = useUpdateTaskStatus();
  const isCompleted = task.status === 'completed';

  const handleStatusToggle = () => {
    const next = isCompleted ? 'todo' : 'completed';
    updateStatus({ taskId: task.id, status: next });
  };

  return (
    <div
      className={cn(
        'group flex flex-col sm:flex-row sm:items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-default',
        'border border-transparent',
        'hover:bg-secondary/60 hover:border-border',
        isCompleted && 'opacity-50'
      )}
    >
      <div className="flex items-start sm:items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
        {/* Status toggle button */}
        <button
          onClick={handleStatusToggle}
          disabled={isPending}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          className={cn(
            'flex-shrink-0 transition-all disabled:opacity-40 focus:outline-none mt-0.5 sm:mt-0',
            isCompleted
              ? 'text-brand'
              : 'text-border hover:text-brand group-hover:text-muted-foreground'
          )}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : task.status === 'in_progress' ? (
            <Clock className="h-5 w-5 text-warning" />
          ) : (
            <Circle className="h-5 w-5 stroke-[1.5]" />
          )}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h4 className={cn(
            'text-[14px] font-medium truncate leading-snug',
            isCompleted
              ? 'line-through text-muted-foreground'
              : 'text-foreground'
          )}>
            {task.title}
          </h4>
          <p className="text-[12px] text-muted-foreground mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
            {task.status === 'in_progress' && (
              <>
                <span className="hidden sm:inline text-border">·</span>
                <span className="text-warning font-medium">In Progress</span>
                <span className="hidden sm:inline text-border">·</span>
                <span className="w-full sm:w-auto text-muted-foreground mt-0.5 sm:mt-0">Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}</span>
              </>
            )}
          </p>
          {task.description && (
            <p className={cn(
              "text-[12px] text-muted-foreground mt-1 truncate",
              isCompleted && "opacity-50"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>

      {/* Priority badge — visible on hover or if urgent */}
      {(task.priority === 'urgent' || task.priority === 'high') && (
        <span className={cn(
          'flex-shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap transition-opacity self-start sm:self-center ml-8 sm:ml-0',
          task.priority === 'urgent'
            ? 'bg-red-500 text-white border-transparent dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'
            : 'bg-amber-500 text-white border-transparent dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
          isCompleted ? 'opacity-0 group-hover:opacity-50' : 'opacity-100'
        )}>
          {PRIORITY_LABEL[task.priority]}
        </span>
      )}
    </div>
  );
}

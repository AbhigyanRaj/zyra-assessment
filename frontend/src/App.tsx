import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useActionCenter } from './api/queries';
import { ThemeToggle } from './components/action-center/ThemeToggle';
import { StudentHeader } from './components/action-center/StudentHeader';
import { TaskList } from './components/action-center/TaskList';
import { MessageList } from './components/action-center/MessageList';
import { Skeleton } from './components/ui/Skeleton';
import { cn } from './lib/utils';

const queryClient = new QueryClient();

// The 3 students owned by counselor csl_001.
// In a real app, this list would be fetched via GET /counselors/:id/students
// authenticated by a JWT containing the counselorId.
const STUDENTS = [
  { id: 'stu_001', name: 'Maya Patel',    initials: 'MP', status: 'at_risk' },
  { id: 'stu_002', name: 'Jordan Lee',   initials: 'JL', status: 'active'  },
  { id: 'stu_003', name: 'Carlos Rivera', initials: 'CR', status: 'at_risk' },
] as const;

// ─── ActionCenter ───────────────────────────────────────────────────────────
interface ActionCenterProps {
  studentId: string;
}

function ActionCenter({ studentId }: ActionCenterProps) {
  const { data, isLoading, isError } = useActionCenter(studentId);

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-[120px] w-full rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <Skeleton className="h-[52px] w-full rounded-xl" />
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-[52px] w-full rounded-xl" />
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
        <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center text-2xl">⚠️</div>
        <p className="text-sm font-medium">Could not connect to backend</p>
        <p className="text-xs text-muted-foreground">Make sure the server is running on port 3001</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentHeader
        student={data.student}
        urgentTaskCount={data.urgentTaskCount}
        unreadCount={data.unreadCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TaskList tasks={data.tasks} />
        </div>
        <div>
          <MessageList messages={data.messages} />
        </div>
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
function App() {
  // Active student — counselor selects which student to review.
  // Defaults to stu_001. React Query caches each student separately,
  // so switching back is instant.
  const [activeStudentId, setActiveStudentId] = useState<string>('stu_001');

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground transition-colors grid-texture">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

          {/* ── Navbar ─────────────────────────────────────────────── */}
          <header className="flex items-center justify-between mb-10">
            <span className="font-brand font-bold text-2xl tracking-tight text-foreground select-none">
              zyra
            </span>
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-xs text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5 font-medium">
                Counselor Portal
              </span>
              <ThemeToggle />
            </div>
          </header>

          {/* ── Page heading ───────────────────────────────────────── */}
          <div className="mb-6">
            <h1 className="text-[28px] font-bold tracking-tight text-foreground">Action Center</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select a student below to review their priorities, tasks, and messages.
            </p>
          </div>

          {/* ── Student selector ───────────────────────────────────── */}
          {/*
            This demonstrates the dynamic /students/:id/action-center endpoint.
            In production, this list would come from GET /counselors/:id/students
            (scoped by a JWT-authenticated counselorId). Currently uses the 3
            mock students all assigned to counselorId: "csl_001".
          */}
          <div className="flex items-center gap-2 mb-8 flex-wrap">
            {STUDENTS.map(student => {
              const isActive = activeStudentId === student.id;
              const isAtRisk = student.status === 'at_risk';
              return (
                <button
                  key={student.id}
                  onClick={() => setActiveStudentId(student.id)}
                  className={cn(
                    'flex items-center gap-2.5 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
                    isActive
                      ? 'bg-card border-brand/40 text-foreground shadow-sm'
                      : 'bg-card/50 border-border text-muted-foreground hover:text-foreground hover:bg-card hover:border-border'
                  )}
                >
                  {/* Avatar initials */}
                  <span className={cn(
                    'h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                    isActive
                      ? 'bg-brand/10 text-brand'
                      : 'bg-secondary text-muted-foreground'
                  )}>
                    {student.initials}
                  </span>
                  {student.name}
                  {/* Risk dot */}
                  {isAtRisk && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Action Center content ──────────────────────────────── */}
          <main>
            <ActionCenter studentId={activeStudentId} />
          </main>

        </div>
      </div>

      <Toaster
        position="top-right"
        richColors
        toastOptions={{ className: 'font-sans text-sm rounded-xl' }}
      />
    </QueryClientProvider>
  );
}

export default App;

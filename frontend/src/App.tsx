import { useState, useRef, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useActionCenter } from './api/queries';
import { ThemeToggle } from './components/action-center/ThemeToggle';
import { StudentHeader } from './components/action-center/StudentHeader';
import { TaskList } from './components/action-center/TaskList';
import { MessageList } from './components/action-center/MessageList';
import { Skeleton } from './components/ui/Skeleton';
import { cn } from './lib/utils';
import { ChevronDown, Search, Check } from 'lucide-react';

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
  const [activeStudentId, setActiveStudentId] = useState<string>('stu_001');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeStudent = STUDENTS.find(s => s.id === activeStudentId) || STUDENTS[0];
  const filteredStudents = STUDENTS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          {/* ── Page heading & Student Selector ────────────────────── */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold tracking-tight text-foreground">Action Center</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Select a student to review their priorities, tasks, and messages.
              </p>
            </div>

            {/* Scalable Student Dropdown Selector (Handles 1000+ students) */}
            <div className="relative z-10" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={cn(
                  "flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all w-full md:w-[260px]",
                  isDropdownOpen 
                    ? "bg-card border-brand/40 shadow-sm text-foreground" 
                    : "bg-card/50 border-border text-foreground hover:bg-card"
                )}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <span className={cn(
                    "h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 bg-brand/10 text-brand"
                  )}>
                    {activeStudent.initials}
                  </span>
                  <span className="truncate">{activeStudent.name}</span>
                  {activeStudent.status === 'at_risk' && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0 ml-1" />
                  )}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full mt-2 right-0 w-full md:w-[280px] bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2 border-b border-border">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-secondary/50 border border-transparent focus:border-brand/30 focus:bg-secondary rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground/70 text-foreground"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1 scrollbar-hide">
                    {filteredStudents.length === 0 ? (
                      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                        No students found.
                      </div>
                    ) : (
                      filteredStudents.map(student => (
                        <button
                          key={student.id}
                          onClick={() => {
                            setActiveStudentId(student.id);
                            setIsDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2.5 rounded-lg text-sm transition-colors",
                            activeStudentId === student.id
                              ? "bg-brand/10 text-brand font-medium"
                              : "hover:bg-secondary text-foreground"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={cn(
                              "h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                              activeStudentId === student.id ? "bg-brand/20" : "bg-secondary text-muted-foreground border border-border/50"
                            )}>
                              {student.initials}
                            </span>
                            {student.name}
                            {student.status === 'at_risk' && (
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            )}
                          </div>
                          {activeStudentId === student.id && <Check className="h-4 w-4" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
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

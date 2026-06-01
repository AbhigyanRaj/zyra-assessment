import type { Student } from '../../types';
import { GraduationCap, Mail, AlertTriangle, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StudentHeaderProps {
  student: Student;
  urgentTaskCount: number;
  unreadCount?: number;
}

const STATUS_CONFIG = {
  at_risk:  { label: 'At Risk',  dot: 'bg-red-500',    badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
  active:   { label: 'Active',   dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
  on_leave: { label: 'On Leave', dot: 'bg-amber-500',   badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
} as const;

export function StudentHeader({ student, urgentTaskCount, unreadCount = 0 }: StudentHeaderProps) {
  const initials = student.name.split(' ').map(n => n[0]).join('');
  const status = STATUS_CONFIG[student.enrollmentStatus as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.active;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover-lift shadow-sm">
      <div className="px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

          {/* ── Left: Avatar + identity ── */}
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="h-14 w-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                <span className="font-brand font-bold text-lg text-brand">{initials}</span>
              </div>
              {/* Status dot */}
              <span className={cn(
                'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card',
                status.dot
              )} />
            </div>

            {/* Name + meta */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold tracking-tight text-foreground leading-none">
                  {student.name}
                </h2>
                {/* Status pill */}
                <span className={cn(
                  'inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border',
                  status.badge
                )}>
                  {status.label}
                </span>
              </div>

              {/* Metadata row — responsive wrap on mobile */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 flex-shrink-0" />
                  Grade {student.grade}
                </span>
                <span className="hidden sm:block w-px h-3 bg-border flex-shrink-0" />
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
                  {student.gpa} GPA
                </span>
                <span className="hidden sm:block w-px h-3 bg-border flex-shrink-0" />
                <span className="flex items-center gap-1.5 w-full sm:w-auto mt-0.5 sm:mt-0">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{student.email}</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Right: Stats + single urgent alert ── */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 w-full sm:w-auto">

            {/* Quick stats — minimal horizontal pills */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial flex flex-col items-center bg-secondary border border-border rounded-xl px-4 py-2.5 min-w-[56px]">
                <span className="text-base font-bold text-foreground leading-none tabular-nums">{student.grade}</span>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium">Grade</span>
              </div>
              <div className="flex-1 sm:flex-initial flex flex-col items-center bg-secondary border border-border rounded-xl px-4 py-2.5 min-w-[56px]">
                <span className="text-base font-bold text-foreground leading-none tabular-nums">{student.gpa}</span>
                <span className="text-[10px] text-muted-foreground mt-1 font-medium">GPA</span>
              </div>
              {unreadCount > 0 && (
                <div className="flex-1 sm:flex-initial flex flex-col items-center bg-secondary border border-border rounded-xl px-4 py-2.5 min-w-[56px]">
                  <span className="text-base font-bold text-foreground leading-none tabular-nums">{unreadCount}</span>
                  <span className="text-[10px] text-muted-foreground mt-1 font-medium">Unread</span>
                </div>
              )}
            </div>

            {/* Urgent alert — SINGLE indicator, subtle left-border style */}
            {urgentTaskCount > 0 && (
              <div className="flex items-center gap-2.5 pl-0 sm:pl-3 sm:border-l-2 border-red-400 mt-2 sm:mt-0 w-full sm:w-auto">
                <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-foreground leading-none">{urgentTaskCount} urgent</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">need attention</p>
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

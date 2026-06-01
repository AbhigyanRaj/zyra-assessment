import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import type { Message } from '../../types';
import { cn } from '../../lib/utils';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const sorted = [...messages].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  );

  const unreadCount = sorted.filter(m => !m.read).length;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover-lift h-full flex flex-col">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">Inbox</h2>
        </div>
        {unreadCount > 0 && (
          <span className="text-[11px] font-semibold bg-brand text-brand-foreground rounded-full px-2 py-0.5 tabular-nums">
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Message rows */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-3 opacity-20" />
            <p className="text-sm font-medium">No messages</p>
          </div>
        ) : (
          sorted.map(msg => (
            <div
              key={msg.id}
              className={cn(
                'flex gap-3 px-4 py-3.5 transition-colors hover:bg-secondary/50 cursor-pointer',
                !msg.read && 'bg-brand/[0.03]'
              )}
            >
              {/* Sender avatar */}
              <div
                className={cn(
                  'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold border mt-0.5',
                  !msg.read
                    ? 'bg-brand text-brand-foreground border-transparent'
                    : 'bg-secondary text-muted-foreground border-border'
                )}
              >
                {(msg.from ?? msg.subject ?? 'M').charAt(0).toUpperCase()}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn(
                    'text-[13px] truncate',
                    !msg.read ? 'font-semibold text-foreground' : 'font-medium text-foreground/80'
                  )}>
                    {msg.from}
                  </p>
                  <span className="text-[11px] text-muted-foreground flex-shrink-0">
                    {formatDistanceToNow(new Date(msg.receivedAt), { addSuffix: true })}
                  </span>
                </div>
                <p className={cn(
                  'text-[13px] mt-0.5 truncate',
                  !msg.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}>
                  {msg.subject}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                  {msg.preview ?? msg.content}
                </p>
              </div>

              {/* Unread indicator — brand indigo dot in light, neutral white in dark */}
              {!msg.read && (
                <div className="flex-shrink-0 flex items-center mt-1.5">
                  <div className="h-2 w-2 rounded-full bg-brand dark:bg-foreground/60" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

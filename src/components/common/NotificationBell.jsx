import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/notificationService';
import { timeAgo } from '../../utils/formatDate';

const POLL_INTERVAL_MS = 30000;

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();

  const load = () => {
    getNotifications()
      .then((res) => {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (!user) return;
    load();
    const interval = setInterval(load, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!user) return null;

  const handleOpen = () => {
    setOpen((o) => !o);
    if (!open) load(); // refresh right as the dropdown opens
  };

  const handleClickNotification = async (n) => {
    setOpen(false);
    if (!n.isRead) {
      setNotifications((prev) => prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)));
      setUnreadCount((c) => Math.max(0, c - 1));
      markNotificationRead(n._id).catch(() => {});
    }
    if (n.link) navigate(n.link);
  };

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full hover:bg-elevated transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 min-w-[18px] px-1 rounded-full bg-accent-red text-white text-[10px] font-bold flex items-center justify-center font-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Dimmed backdrop — closes the panel on click and keeps focus on the notifications */}
          <div
            className="fixed inset-x-0 top-16 bottom-0 z-40 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* Centered notification panel — always centered on the screen, at every breakpoint */}
          <div className="fixed left-1/2 top-16 -translate-x-1/2 z-50 w-[90vw] max-w-sm bg-card border border-border rounded-card shadow-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-text-primary">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-medium text-accent hover:text-accent-dark inline-flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-8">You're all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n._id}
                    onClick={() => handleClickNotification(n)}
                    className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-elevated transition-colors ${
                      !n.isRead ? 'bg-accent-soft' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />}
                      <div className={n.isRead ? 'ml-3.5' : ''}>
                        <p className="text-sm font-medium text-text-primary">{n.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
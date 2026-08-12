import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/notificationService';
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
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!user) return null;

  const handleOpen = () => {
    setOpen((current) => !current);

    if (!open) {
      load();
    }
  };

  const handleClickNotification = async (notification) => {
    setOpen(false);

    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id
            ? { ...item, isRead: true }
            : item
        )
      );

      setUnreadCount((count) => Math.max(0, count - 1));

      markNotificationRead(notification._id).catch(() => {});
    }

    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = async (event) => {
    event.stopPropagation();

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        isRead: true,
      }))
    );

    setUnreadCount(0);

    markAllNotificationsRead().catch(() => {});
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleOpen}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative w-9 h-9 rounded-full flex items-center justify-center text-text-primary hover:bg-elevated transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30"
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-200 ${
            open ? 'scale-105' : ''
          }`}
        />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-accent-red text-white text-[10px] font-bold font-nums flex items-center justify-center border-2 border-base">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Notification panel */}
          <div className="fixed sm:absolute left-1/2 sm:left-auto sm:right-0 top-16 sm:top-12 -translate-x-1/2 sm:translate-x-0 z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  Notifications
                </h3>

                {unreadCount > 0 && (
                  <p className="text-[11px] text-text-muted mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-accent hover:text-accent-dark inline-flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications */}
            <div className="max-h-[min(70vh,420px)] overflow-y-auto scrollbar-none">
              {notifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-5 h-5 text-accent" />
                  </div>

                  <p className="text-sm font-medium text-text-primary">
                    You're all caught up
                  </p>

                  <p className="text-xs text-text-muted mt-1">
                    New order and account updates will appear here.
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    key={notification._id}
                    type="button"
                    onClick={() =>
                      handleClickNotification(notification)
                    }
                    className={`w-full text-left px-4 py-3.5 border-b border-border last:border-0 transition-colors hover:bg-elevated ${
                      !notification.isRead
                        ? 'bg-accent-soft/60'
                        : 'bg-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1.5">
                        {notification.isRead ? (
                          <span className="block w-1.5 h-1.5 rounded-full bg-border-strong" />
                        ) : (
                          <span className="block w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p
                            className={`text-sm leading-snug ${
                              notification.isRead
                                ? 'font-medium text-text-secondary'
                                : 'font-semibold text-text-primary'
                            }`}
                          >
                            {notification.title}
                          </p>

                          {!notification.isRead && (
                            <span className="flex-shrink-0 text-[9px] font-bold uppercase tracking-wide text-accent">
                              New
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                          {notification.message}
                        </p>

                        <p className="text-[10px] text-text-muted mt-1.5">
                          {timeAgo(notification.createdAt)}
                        </p>
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
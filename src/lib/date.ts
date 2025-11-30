/**
 * Date Formatting Utilities
 * Using date-fns for consistent date handling
 */

import {
  format,
  formatDistance,
  formatRelative,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
} from "date-fns";

/**
 * Format date to full format (e.g., "December 15, 2024")
 */
export function formatDateFull(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMMM dd, yyyy");
}

/**
 * Format date to short format (e.g., "Dec 15, 2024")
 */
export function formatDateShort(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

/**
 * Format time (e.g., "02:30 PM")
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "hh:mm a");
}

/**
 * Format datetime (e.g., "Dec 15, 2024 02:30 PM")
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "MMM dd, yyyy hh:mm a");
}

/**
 * Format date to ISO (e.g., "2024-12-15")
 */
export function formatDateISO(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, "yyyy-MM-dd");
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
}

/**
 * Format relative date with context (e.g., "Today at 2:30 PM", "Yesterday at 5:00 PM")
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatRelative(dateObj, new Date());
}

/**
 * Format smart date (context-aware)
 * - Today: "Today at 2:30 PM"
 * - Yesterday: "Yesterday at 2:30 PM"
 * - This week: "Monday at 2:30 PM"
 * - This month: "Dec 15 at 2:30 PM"
 * - This year: "Dec 15, 2024"
 * - Older: "Dec 15, 2023"
 */
export function formatSmartDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "hh:mm a")}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "hh:mm a")}`;
  }

  if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE 'at' hh:mm a");
  }

  if (isThisMonth(dateObj)) {
    return format(dateObj, "MMM dd 'at' hh:mm a");
  }

  if (isThisYear(dateObj)) {
    return format(dateObj, "MMM dd, yyyy");
  }

  return format(dateObj, "MMM dd, yyyy");
}

/**
 * Get time ago in short format
 * - < 1 min: "Just now"
 * - < 1 hour: "Xm ago"
 * - < 24 hours: "Xh ago"
 * - < 7 days: "Xd ago"
 * - Older: Full date
 */
export function getTimeAgoShort(date: string | Date): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const now = new Date();

  const minutes = differenceInMinutes(now, dateObj);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = differenceInHours(now, dateObj);
  if (hours < 24) return `${hours}h ago`;

  const days = differenceInDays(now, dateObj);
  if (days < 7) return `${days}d ago`;

  return formatDateShort(dateObj);
}

/**
 * Format duration in seconds to human-readable
 * (e.g., 3665 -> "1h 1m 5s" or "1:01:05")
 */
export function formatDuration(seconds: number, compact: boolean = false): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (compact) {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj < new Date();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return dateObj > new Date();
}

/**
 * Get date range label (e.g., "Last 7 days", "Last 30 days")
 */
export function getDateRangeLabel(days: number): string {
  if (days === 1) return "Today";
  if (days === 7) return "Last 7 days";
  if (days === 30) return "Last 30 days";
  if (days === 90) return "Last 3 months";
  if (days === 365) return "Last year";
  return `Last ${days} days`;
}

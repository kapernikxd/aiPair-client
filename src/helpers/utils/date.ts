import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(relativeTime);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);

// "2025-05-31T15:00:00" → "2 hours ago"
export const getTimeAgo = (time: string) =>
  time ? dayjs(time).fromNow() : null;

// "2025-05-31T17:00:00" → "2025-05-31 17:00:00"
export const getDateShow = (date: string) =>
  date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : null;

// "2025-05-31T17:00:00" → "31 May, 17:00"
export const getStartDate = (date?: string | Date) =>
  date ? dayjs(date).format("D MMMM, HH:mm") : null;

// "2025-05-31T17:00:00" → "31 May, 17:00"
export const getDateTime = (date: string) =>
  date ? dayjs(date).format("D MMM, HH:mm") : null;

//  * Пример:
//  * - "2022-08-15" → "August 2022"
//  * - "2025-01-01" → "January 2025"
//  */
export const getMonthYear = (date: string | Date) => {
  return dayjs(date).format("MMMM YYYY");
};

// lastSeen более 12ч назад → "31 May 2025, 17:00"
// lastSeen менее 12ч назад → "2 hours ago"
export const formatLastSeen = (lastSeen: string | null): string => {
  if (!lastSeen) return "";
  if (dayjs().diff(dayjs(lastSeen), "hours") > 12) {
    return dayjs(lastSeen).format("D MMM YYYY, HH:mm"); 
  } else {
    return dayjs(lastSeen).fromNow(); 
  }
};

/**
 * Если сообщение отправлено:
 *  - меньше 5 минут назад → "a few seconds ago", "2 minutes ago"
 *  - сегодня, но более 5 мин назад → "14:25"
 *  - в другой день → "31 May, 17:00"
 */
export const getSmartTime = (time: string) => {
  if (!time) return null;

  const now = dayjs();
  const messageTime = dayjs(time);

  if (messageTime.isSame(now, "day")) {
    const diffInMinutes = now.diff(messageTime, "minute");
    if (diffInMinutes <= 5) {
      return messageTime.fromNow(); 
    }
    return messageTime.format("HH:mm"); 
  }

  return messageTime.format("D MMM, HH:mm"); 
};

// Reserved utility placeholders have been removed because they were unused.

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const lessonDateTime = (
  date: string,
  time: string,
  tz: string = "Europe/London",
) => {
  return dayjs.tz(`${date} ${time}`, "YYYY-MM-DD HH:mm", tz);
};

export const formatLessonTime = (
  date: string,
  time: string,
  tz: string = "Europe/London",
) => {
  return lessonDateTime(date, time, tz).format("h:mm A");
};

export const formatLessonDate = (
  date: string,
  tz: string = "Europe/London",
) => {
  return dayjs
    .tz(`${date} 00:00`, "YYYY-MM-DD HH:mm", tz)
    .format("ddd, D MMM YYYY");
};

export const isLessonInPast = (
  date: string,
  startTime: string,
  tz: string = "Europe/London",
) => {
  return lessonDateTime(date, startTime, tz).isBefore(dayjs());
};

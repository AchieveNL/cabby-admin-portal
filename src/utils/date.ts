import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(utc);

export default dayjs;

const tz = 'Europe/Amsterdam';
const netherlandsOffset = () => dayjs().tz(tz).utcOffset();

export const utcOffset = dayjs().utcOffset();
export const dayjsExtended = dayjs;
export const netherlandsTimeNow = () =>
  dayjs().utc().add(netherlandsOffset(), 'm').toDate();

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(utc);

export default dayjs;

export const netherlandsTimeNow = dayjs().utc().add(2, 'h');

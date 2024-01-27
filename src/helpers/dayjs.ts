import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isBetween);

dayjs.tz.setDefault('Asia/Bangkok');

export default dayjs;

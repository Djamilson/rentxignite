import { eachDayOfInterval, startOfMonth, endOfMonth, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import { MarkedDateProps, DayProps } from '.';
import { getPlatformDate } from '../../utils/getPlatformDate';
import theme from '../../global/theme';

function meDateStart(startDate: DayProps): Date {
  const now = new Date(startDate.dateString);
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  console.log('akii: ', utc);

  return utc;
}

function meDateEnd(end_date: DayProps): Date {
  const now = new Date(end_date.dateString);
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  
  return utc;
}

export function generateInterval(start: DayProps, end: DayProps) {
  let interval: MarkedDateProps = {};

  eachDayOfInterval({
    start: meDateStart(start),
    end: meDateEnd(end),
  }).forEach((item) => {
    console.log('=>> dentro: function Item', item);

    const date = format(getPlatformDate(item), 'yyyy-MM-dd');

    console.log('=>> getPlatformDate(item)', getPlatformDate(item));

    console.log('=>> como fica dentro: function', date);

    interval = {
      ...interval,
      [date]: {
        color:
          start.dateString === date || end.dateString === date
            ? theme.colors.main
            : theme.colors.main_light,

        textColor:
          start.dateString === date || end.dateString === date
            ? theme.colors.main_light
            : theme.colors.main,
      },
    };
  });

  return interval;
}

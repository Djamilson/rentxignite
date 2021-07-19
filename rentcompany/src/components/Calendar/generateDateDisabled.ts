import { format } from 'date-fns';

import { MarkedDateProps } from '.';
import { getPlatformDate } from '../../utils/getPlatformDate';
import theme from '../../global/theme';

function meDate(date: Date): Date {
  const now = new Date(date);
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  return utc;
}


export function generateDateDisabled(dataBD: Date[]) {
  let interval: MarkedDateProps = {};

  dataBD?.map((item) => {


    const date = format(getPlatformDate(meDate(item)), 'yyyy-MM-dd');

    interval = {
      ...interval,
      [date]: {
        textColor: theme.colors.success,
        disabled: true,
        disableTouchEvent: true,
      },
    };
  });

  return interval;
}

import { eachDayOfInterval, format } from 'date-fns';

import { MarkedDateProps } from '.';
import { getPlatformDate } from '../../utils/getPlatformDate';
import theme from '../../global/theme';

export function generateDateDisabled(dataBD: Date[]) {
  let interval: MarkedDateProps = {};

  dataBD.map((item) => {
    const date = format(getPlatformDate(new Date(item)), 'yyyy-MM-dd');

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

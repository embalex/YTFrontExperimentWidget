export const dateToString = (date: Date): string => date
  .toISOString()
  .split('T')[0]
  .replaceAll('-', '.');

export type DurationInDays = {
  type: 'equal'
} | {
  type: 'left';
  value: number;
} | {
  type: 'passed';
  value: number;
};

export const calcDurationInDays = (date: Date): DurationInDays => {
  const convertToDays = (valueMs: number): number => {
    const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
    return Math.floor(valueMs / MILLISECONDS_IN_A_DAY);
  };

  const startOfToday = new Date(dateToString(new Date()));
  const nowInDays = convertToDays((new Date(startOfToday)).valueOf());
  const srcInDays = convertToDays(date.valueOf());

  if (nowInDays === srcInDays) {
    return { type: 'equal' };
  }

  if (nowInDays < srcInDays) {
    return {
      type: 'left',
      value: srcInDays - nowInDays,
    };
  }

  return {
    type: 'passed',
    value: nowInDays - srcInDays,
  };
};

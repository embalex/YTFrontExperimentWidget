import React from 'react';
import { dateToString, DurationInDays } from '../../utils';

interface Props {
  decisionDate: Date;
  durationInDays: DurationInDays;
}

export const DecisionInformation: React.FC<Props> = ({ decisionDate, durationInDays }) => {
  const dateAsString = dateToString(decisionDate);

  switch (durationInDays.type) {
    case 'equal': return <p>Принятие решения о закрытии сегодня!</p>;
    case 'left': return <p>{`Принятие решения о закрытии ${dateAsString}. Осталось ${durationInDays.value} дн.`}</p>;
    case 'passed': return <p>{`Принятие решения о закрытии ${dateAsString}. Просрочено на ${durationInDays.value} дн.`}</p>;
    default: return null;
  }
};

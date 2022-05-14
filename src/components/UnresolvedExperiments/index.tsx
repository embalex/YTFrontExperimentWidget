import React from 'react';
import { useUnresolvedExperiments } from './useUnresolvedExperiments';
import { getContent, isErrorResource, isLoadingResource } from '../../utils';

export const UnresolvedExperiments: React.FC = () => {
  const unresolved = useUnresolvedExperiments();

  if (isLoadingResource(unresolved)) {
    return <p>Подождите, сейчас разберусь и все покажу ))</p>;
  }

  if (isErrorResource(unresolved)) {
    return <p>Нешмогла я, сложно там все.</p>;
  }

  return (
    <>
      <h4>Активные эксперименты</h4>
      {getContent(unresolved).map(({ name }) => (
        <div key={name}>
          <p>{name}</p>
          <p>Закрывающая задача: (...)</p>
          <p>{`Реализован: ${'createdDate'}, (столько-то дней назад)`}</p>
          <p>{`Ожидается принятие решения по закрытию: ${'дата принятия решения'}, (осталось NNN дней)`}</p>
        </div>
      ))}
    </>
  );
};

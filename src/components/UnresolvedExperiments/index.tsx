import React from 'react';
import { useUnresolvedExperiments } from '../useUnresolvedExperiments';
import {
  getContent, isErrorResource, isLoadingResource,
} from '../../utils';
import { DecisionInformation } from '../DecisionInformation';
import { getBorderColor } from './utils';
import './Unresolvedexperiments.css';

export const UnresolvedExperiments: React.FC = () => {
  const unresolved = useUnresolvedExperiments();

  if (isLoadingResource(unresolved)) {
    return <p>Подождите, сейчас разберусь и все покажу ))</p>;
  }

  if (isErrorResource(unresolved)) {
    return <p>Нешмогла я, сложно там все.</p>;
  }

  const issues = getContent(unresolved);
  if (issues.length === 0) {
    return <img src="thumbUp.svg" alt="thumbUp" className="issue__thumb-up" />;
  }

  return (
    <>
      {issues.map((issue) => (
        <div className="issue__block" style={{ borderColor: getBorderColor(issue) }} key={issue.name.id}>
          <p>
            <a href={`/issue/${issue.name.id}`} target="_blank" rel="noreferrer">{issue.name.id}</a>
            &nbsp;
            {issue.name.summary}
          </p>
          {issue.durationFromResolvingInDays && issue.durationFromResolvingInDays.type === 'passed' && (
            <p>{`Эксперимент длится уже ${issue.durationFromResolvingInDays.value} дн.`}</p>
          )}
          {issue.type === 'isMoreThanOneClosingIssue' && <p>Эксперимент имеет больше, чем одну закрывающую задачу</p>}
          {issue.type === 'isWithoutClosingIssue' && <p>Эксперимент не имеет закрывающую задачу</p>}
          {issue.type === 'isWithoutDecisionDate' && (
            <>
              <p>{`Закрывающая задача: ${issue.closingIssue.name}`}</p>
              <p>Нет времени принятия решения!</p>
            </>
          )}
          {issue.type === 'valid' && (
            <>
              <p>
                Закрывающая задача:
                &nbsp;
                <a href={`/issue/${issue.name.id}`} target="_blank" rel="noreferrer">{issue.name.id}</a>
                &nbsp;
                {issue.name.summary}
              </p>
              <DecisionInformation
                decisionDate={issue.closingIssue.decisionDate}
                durationInDays={issue.closingIssue.durationInDaysToDecisionDate}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};

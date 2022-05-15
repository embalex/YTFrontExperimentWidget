import { UnresolvedExperiment } from '../useUnresolvedExperiments/types';

export const getBorderColor = (issue: UnresolvedExperiment) => {
  enum ColorsEnum {
    Error = 'red',
    Warning = 'yellow',
    Success = 'green',
  }

  if (
    issue.type === 'isMoreThanOneClosingIssue'
      || issue.type === 'isWithoutClosingIssue'
      || issue.type === 'isWithoutDecisionDate'
  ) {
    return ColorsEnum.Error;
  }

  const { durationInDaysToDecisionDate } = issue.closingIssue;
  if (durationInDaysToDecisionDate.type === 'passed') {
    return ColorsEnum.Error;
  }

  if (durationInDaysToDecisionDate.type === 'equal') {
    return ColorsEnum.Warning;
  }

  return ColorsEnum.Success;
};

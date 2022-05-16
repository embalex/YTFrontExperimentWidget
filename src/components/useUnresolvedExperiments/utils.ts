import {
  ClosingIssue, IssueDto, LinkedIssueDto, UnresolvedExperiment, IssueName,
} from './types';
import { DecisionDateRegExp, ExperimentTag } from '../../constants';
import { calcDurationInDays } from '../../utils';

export const makeIssue = (name: IssueName, resolveDate: Date | null) => {
  const durationFromResolvingInDays = resolveDate === null ? null : calcDurationInDays(resolveDate);

  return {
    withMoreThanOneClosingTag: ():UnresolvedExperiment => ({
      type: 'isMoreThanOneClosingIssue',
      name,
      durationFromResolvingInDays,
    }),
    withoutClosingIssue: ():UnresolvedExperiment => ({
      type: 'isWithoutClosingIssue',
      name,
      durationFromResolvingInDays,
    }),
    withoutDecisionDate: (
      closingIssueName: IssueName,
    ): UnresolvedExperiment => ({
      type: 'isWithoutDecisionDate',
      name,
      durationFromResolvingInDays,
      closingIssue: {
        name: closingIssueName,
      },
    }),
    valid: (
      closingIssueName: IssueName,
      closingIssueDecisionDate: Date,
    ): UnresolvedExperiment => ({
      type: 'valid',
      name,
      durationFromResolvingInDays,
      closingIssue: {
        name: closingIssueName,
        decisionDate: closingIssueDecisionDate,
        durationInDaysToDecisionDate: calcDurationInDays(closingIssueDecisionDate),
      },
    }),
  };
};

export const getClosingIssues = (src: IssueDto): ClosingIssue[] => {
  const relatedIssuesLinks = src.links.filter(({ linkType }) => linkType.name === 'Relates');
  const relatedIssues = relatedIssuesLinks.reduce<LinkedIssueDto[]>(
    (acc, { issues }) => ([...acc, ...issues]),
    [],
  );

  const closingIssues = relatedIssues.filter(({ tags }) => {
    const issueTags = tags.map(({ name: tagName }) => tagName);
    return issueTags.includes(ExperimentTag.Close);
  });

  return closingIssues.map<ClosingIssue>((closingIssueDto) => {
    const name: IssueName = {
      id: closingIssueDto.idReadable,
      summary: closingIssueDto.summary,
    };

    if (closingIssueDto.resolved) {
      return {
        name,
        isClosed: true,
      };
    }

    const messages = closingIssueDto.comments
      .filter(({ deleted, text }) => !deleted && text.match(DecisionDateRegExp));

    if (messages.length === 0) {
      return {
        name,
        isClosed: false,
        decisionDate: null,
      };
    }

    const lastMessage = messages[messages.length - 1];
    const dateString = lastMessage.text.slice(-10);

    return {
      name,
      isClosed: false,
      decisionDate: Number.isNaN(Date.parse(dateString)) ? null : new Date(dateString),
    };
  });
};

const compareByType = (
  type: UnresolvedExperiment['type'],
  value1: UnresolvedExperiment,
  value2: UnresolvedExperiment,
): number | null => {
  if (value1.type === type && value2.type !== type) {
    return -1;
  }

  if (value1.type !== type && value2.type === type) {
    return 1;
  }

  if (value1.type === type && value2.type === type) {
    return 0;
  }

  return null;
};

const compareByDecisionDate = (
  value1: UnresolvedExperiment,
  value2: UnresolvedExperiment,
): number | null => {
  if (value1.type !== 'valid' || value2.type !== 'valid') {
    throw new Error(`compareByDecisionDate. Value type is invalid: ${JSON.stringify({ value1, value2 })}`);
  }

  const value1Duration = value1.closingIssue.durationInDaysToDecisionDate;
  const value2Duration = value2.closingIssue.durationInDaysToDecisionDate;

  // 1. Passed
  if (value1Duration.type === 'passed' && value2Duration.type !== 'passed') {
    return -1;
  }

  if (value1Duration.type !== 'passed' && value2Duration.type === 'passed') {
    return 1;
  }

  if (value1Duration.type === 'passed' && value2Duration.type === 'passed') {
    // compare by days
    return value2Duration.value - value1Duration.value;
  }

  // 2. Today
  if (value1Duration.type === 'equal' && value2Duration.type !== 'equal') {
    return -1;
  }

  if (value1Duration.type !== 'equal' && value2Duration.type === 'equal') {
    return 1;
  }

  if (value1Duration.type === 'equal' && value2Duration.type === 'equal') {
    return 0;
  }

  // 3. Left
  if (value1Duration.type === 'left' && value2Duration.type !== 'left') {
    return -1;
  }

  if (value1Duration.type !== 'left' && value2Duration.type === 'left') {
    return 1;
  }

  if (value1Duration.type === 'left' && value2Duration.type === 'left') {
    return value1Duration.value - value2Duration.value;
  }

  return null;
};

export const compareUnresolvedExperiments = (
  a: UnresolvedExperiment,
  b: UnresolvedExperiment,
): number => {
  // 1. Tasks without closing issue
  const comparedByWithoutClosingIssue = compareByType('isWithoutClosingIssue', a, b);
  if (comparedByWithoutClosingIssue !== null) {
    return comparedByWithoutClosingIssue;
  }

  // 2. Tasks with more than one closing issue
  const comparedByWithMoreThanOneClosingIssue = compareByType('isMoreThanOneClosingIssue', a, b);
  if (comparedByWithMoreThanOneClosingIssue !== null) {
    return comparedByWithMoreThanOneClosingIssue;
  }

  // 3. Tasks without decision date
  const comparedByWithoutDecisionDate = compareByType('isWithoutDecisionDate', a, b);
  if (comparedByWithoutDecisionDate !== null) {
    return comparedByWithoutDecisionDate;
  }

  // 4. Tasks with decision date
  const comparedByDecisionDate = compareByDecisionDate(a, b);
  if (comparedByDecisionDate !== null) {
    return comparedByDecisionDate;
  }

  return 0;
};

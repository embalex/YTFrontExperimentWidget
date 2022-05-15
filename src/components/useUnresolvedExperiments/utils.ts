import {
  ClosingIssue, IssueDto, LinkedIssueDto, UnresolvedExperiment,
} from './types';
import { DecisionDateRegExp, ExperimentTag } from '../../constants';
import { calcDurationInDays } from '../../utils';

export const makeIssue = (name: string, createdDate: Date | null) => ({
  withMoreThanOneClosingTag: ():UnresolvedExperiment => ({
    type: 'isMoreThanOneClosingIssue',
    name,
    createdDate,
  }),
  withoutClosingIssue: ():UnresolvedExperiment => ({
    type: 'isWithoutClosingIssue',
    name,
    createdDate,
  }),
  withoutDecisionDate: (
    closingIssueName: string,
  ): UnresolvedExperiment => ({
    type: 'isWithoutDecisionDate',
    name,
    createdDate,
    closingIssue: {
      name: closingIssueName,
    },
  }),
  valid: (
    closingIssueName: string,
    closingIssueDecisionDate: Date,
  ): UnresolvedExperiment => ({
    type: 'valid',
    name,
    createdDate,
    closingIssue: {
      name: closingIssueName,
      decisionDate: closingIssueDecisionDate,
      durationInDaysToDecisionDate: calcDurationInDays(closingIssueDecisionDate),
    },
  }),
});

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
    const name = `${closingIssueDto.idReadable}: ${closingIssueDto.summary}`;

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

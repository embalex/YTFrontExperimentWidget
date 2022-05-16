import { DurationInDays } from '../../utils';

export type LinkedIssueDto = {
  tags: { name: string }[];
  summary: string;
  idReadable: string;
  resolved: number | null;
  comments: {
    text: string;
    deleted: boolean;
  }[];
};

export type IssueDto = {
  idReadable: string;
  summary: string;
  created: number;
  links: {
    linkType: { name: string };
    issues: LinkedIssueDto[];
  }[]
};

export type IssueName = {
  id: string;
  summary: string;
};

export type ClosingIssue = {
  name: IssueName;
} & ({
  isClosed: true;
} | {
  isClosed: false;
  decisionDate: Date | null;
});

export type UnresolvedExperiment = {
  name: IssueName;
  durationFromResolvingInDays: DurationInDays | null;
} & ({
  type: 'isMoreThanOneClosingIssue'
} | {
  type: 'isWithoutClosingIssue'
} | {
  type: 'isWithoutDecisionDate',
  closingIssue: {
    name: IssueName;
  };
} | {
  type: 'valid',
  closingIssue: {
    name: IssueName;
    decisionDate: Date;
    durationInDaysToDecisionDate: DurationInDays;
  };
});

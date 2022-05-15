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

export type ClosingIssue = {
  name: string;
} & ({
  isClosed: true;
} | {
  isClosed: false;
  decisionDate: Date | null;
});

export type UnresolvedExperiment = {
  name: string;
  createdDate: Date | null;
} & ({
  type: 'isMoreThanOneClosingIssue'
} | {
  type: 'isWithoutClosingIssue'
} | {
  type: 'isWithoutDecisionDate',
  closingIssue: {
    name: string;
  };
} | {
  type: 'valid',
  closingIssue: {
    name: string;
    decisionDate: Date;
    durationInDaysToDecisionDate: DurationInDays;
  };
});

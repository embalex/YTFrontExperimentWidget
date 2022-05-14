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
  decisionDate: string | null;
});

export type UnresolvedExperiment = {
  name: string;
} & ({
  type: 'isMoreThanOneClosedIssue' | 'isWithoutClosingIssue'
} | {
  type: 'validated',
  closingIssue: {
    name: string;
    decisionDate: string | null;
  };
});

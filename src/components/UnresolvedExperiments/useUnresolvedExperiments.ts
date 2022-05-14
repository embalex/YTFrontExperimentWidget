import { useEffect, useState } from 'react';
import DashboardWidget from '../../DashboardWidget';
import { ExperimentTag } from '../../constants';
import {
  makeLoadingResource, Resource, makeErrorResource, makeContentResource,
} from '../../utils';
import { UnresolvedExperiment, IssueDto } from './types';
import { getClosingIssues, makeIssue } from './utils';

export const useUnresolvedExperiments = ():Resource<UnresolvedExperiment[]> => {
  const [value, setValue] = useState<Resource<UnresolvedExperiment[]>>(makeLoadingResource());

  useEffect(() => {
    const getUnresolvedExperiments = async () => {
      const queryAll = `Team: Frontend Tag: {${ExperimentTag.Create}}`;
      const linksQuery = 'links(linkType(name),issues(tags(name),summary,idReadable,resolved,comments(text,deleted)))';

      try {
        const all = await DashboardWidget.fetch<IssueDto[]>(`api/issues?fields=idReadable,summary,${linksQuery}&query=${encodeURI(queryAll)}`);
        const experiments = all.map<UnresolvedExperiment | null>((dto) => {
          const issue = makeIssue(`${dto.idReadable}: ${dto.summary}`, 'unknown');

          const closingIssues = getClosingIssues(dto);

          if (closingIssues.length > 1) {
            return issue.withMoreThanOneClosingTag();
          }

          if (closingIssues.length === 0) {
            return issue.withoutClosingIssue();
          }

          const closingIssue = closingIssues[0];
          return closingIssue.isClosed
            ? null
            : issue.validated(closingIssue.name, closingIssue.decisionDate);
        })
          .filter(Boolean);

        setValue(makeContentResource(experiments as UnresolvedExperiment[]));
      } catch (e) {
        setValue(makeErrorResource(e as Error));
      }
    };
    getUnresolvedExperiments();
  }, []);

  return value;
};

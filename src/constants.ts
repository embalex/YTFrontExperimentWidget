export enum ExperimentTag {
  Create = 'FE Create experiment', Close = 'FE Close Experiment', Not = 'FE Not experiment',
}

// Decision date string: 'Decision date: YYYY.MM.DD'
export const DecisionDateRegExp = /^Decision date: \d{4}.\d{2}.\d{2}$/m;

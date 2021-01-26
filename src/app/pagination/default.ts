import {PaginationConfig} from './interface';

export const PAGINATION_DEFAULT: PaginationConfig = {
  size: 10,
  current: 0,
  settings: {
    enums: [
      {key: 2, value: 2},
      {key: 5, value: 5},
    ],
    label: 'RESULTS_PER_PAGE',
  },
};

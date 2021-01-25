export interface IPaginationModel extends PaginationState{
  pageSize(): number;
  currentPage(): number; // zero based
  setCurrentPage(page: number): void;
  itemsCount(count?: number): number;
  pagesCount(): number;
  getOffset(): number;
}

export type PaginationState = {
  count: number;
  size: number;
  current: number;
  limit?: number;
};

export interface PaginationUISettings {
  enums: {key: string | number, value: number}[];
  label: string;
}

export type PaginationConfig = Partial<PaginationState> & {settings?: PaginationUISettings};

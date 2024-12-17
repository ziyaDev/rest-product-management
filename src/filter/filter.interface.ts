


export interface WithPagination<T> {
  data: T;
  pagination: {
    totalCount: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}
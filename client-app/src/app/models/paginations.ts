// pagination header send in response.
export interface Pagination{
    currentPage:number;
    pageSize:number;
    totalItems:number;
    totalPages:number;
}

// contains paginated result along with pagination header details.
export class PaginatedResult<T>{
    data:T;
    pagination:Pagination;
    constructor(data:T,pagination:Pagination){
        this.data = data;
        this.pagination = pagination;
    }
}

export class PagingParams{
    pageNumber:number;
    pageSize:number
    constructor(_pageNumber = 1,_pageSize = 2){
        this.pageNumber = _pageNumber;
        this.pageSize = _pageSize;
    }
}
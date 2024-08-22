export interface Response<T> {
	data?: {
        content: T;
		pageSize: number;
		pageIndex: number;
		totalPagesCount: number;
    };
	content?: T;
	success?: boolean;
	status?: boolean;
	totalCount?: number;
	totalPagesCount?:number;
	totalElements?: number;
	code?: number;
	error?: string;
}
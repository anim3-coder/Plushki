export interface HotelReviewDto {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;   // ISO
    userName: string;
    userId: string;
}

export interface HotelReviewsResponse {
    totalCount: number;
    page: number;
    pageSize: number;
    averageRating: number;
    ratingDistribution: number[];   // length 5
    data: HotelReviewDto[];
}
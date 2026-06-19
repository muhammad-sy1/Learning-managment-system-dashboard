export interface IUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
}

export interface IRating {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  can_edit: boolean;
  user: IUser | null;
}

export interface IPaginatedRatings {
  current_page: number;
  data: IRating[];
  last_page: number;
}

export interface IGetRatingsProductResponse {
  data: {
    ratings: {
      current_page: number;
      data: IRating[];
      last_page: number;
      total: number;
    };
  };
}

export interface ICategory {
    id: number;
    name: string;
    parent_id?: number | null;
    student_type: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    parent?: {
        id: number;
        name: string;
    } | null;
    children?: ICategory[];
}

export interface ICreateCategoryPayload {
    name: string;
    student_type: string;
    parent_id?: number | string;
    is_active?: number | boolean;
}

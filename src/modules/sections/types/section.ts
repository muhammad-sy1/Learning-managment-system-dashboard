export interface ISection {
  id: number;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
  parent_id?: number;

  children: ISection[];
}

export interface IGetSectionResponse {
  data: {
    parent_section?: ISection;
    sections: {
      current_page: number;

      data: ISection[];
      last_page: number;
      total?: number;
    };
  };
}

export interface ICreateSectionPayload {
  name: string;
  image?: File;
}
export interface ISubSection {
  id: number;
  name: string;
  parent_id?: number;
  parent_section: {
    id: number;
    name: string;
  };
}
// For filters schema
export interface sectionFiltersSchema {
  page?: number;
  search?: string;
  type: string;
  name?: string;
  parent_id?: string | null;
  // Add any other filter parameters your API supports
}

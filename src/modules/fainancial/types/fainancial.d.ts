export interface IFinancialSection {
  id: number;
  name: string; 
  image: string; 
  created_at: string;
  updated_at: string;
  parent_id?: number;
  children: IFinancialSection[]; 
}

export interface IGetFinancialSectionResponse {
  data: {
    parent_section?: IFinancialSection;
    sections: {
      current_page: number;
      data: IFinancialSection[];
      last_page: number;
      total?: number;
    };
  };
}

export interface ICreateFinancialSectionPayload {
  name: string;
  image?: File;
}

export interface IFinancialSubSection {
  id: number;
  name: string;
  parent_id?: number;
  parent_section: {
    id: number;
    name: string;
  };
}

export interface FinancialSectionFilters {
  page?: number;
  search?: string;
  type: string; 
  name?: string;
  parent_id?: string | null; 
}

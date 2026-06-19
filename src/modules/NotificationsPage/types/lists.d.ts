interface IUserListsResponse {
  account_types: IAccountType[];
  countries: ICountry[];
}

interface IAccountType {
  id: number;
  is_active: number; // 1 or 0
  name: string;
  children: ISpecialty[];
}

interface ISpecialty {
  id: number;
  type: "SPECIALTIES" | "SUB_SPECIALTIES";
  name: string;
  children?: ISubSpecialty[];
}

interface ISubSpecialty {
  id: number;
  type: "SUB_SPECIALTIES";
  name: string;
}

interface ICountry {
  id: number;
  name: string;
  cities: ICity[];
}

interface ICity {
  id: number;
  name: string;
}

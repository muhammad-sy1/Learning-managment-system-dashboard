// types/province.ts
export interface IZone {
  id: number;
  name: string;
  polygon: {
    lat: number;
    lng: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface IGetZoneResponse {
  data: {
    zones: {
      current_page: number;
      data: IZone[];
      last_page: number;
      total: number;
    };
  };
}
export interface ICountry {
  id: number;
  name: string;
  cities?: ICity[];
}
export interface ICreateZonePayload {
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  polygon: {
    lat: number;
    lng: number;
  }[];
}

export interface IUpdateZonePayload {
  name: string;
  center: {
    lat: number;
    lng: number;
  };
  polygon: {
    lat: number;
    lng: number;
  }[];
}

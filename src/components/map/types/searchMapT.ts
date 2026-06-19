export interface IPlace {
  name: string;
  lat: number;
  lng: number;
}

export interface IPlacesData {
  places: IPlace[];
}

export interface IPlacesResponse {
  data: IPlacesData;
}

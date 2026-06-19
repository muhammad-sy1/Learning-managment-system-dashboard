

export interface IOnlineUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string | null;
  last_seen: string;
}

export interface IRangeVisitor extends IOnlineUser {
  request_count: number;
}

export interface IGetOnlineAnalysisResponse {
  data: {
    window_minutes: number;
    users: IOnlineUser[];
  };
}

export interface IGetCurrentHourResponse {
  data: {
    visitors: IOnlineUser[];
  };
}

export interface IGetRangeAnalysisResponse {
  data: {
    from: string;
    to: string;
    visitors: IRangeVisitor[];
  };
}




export interface IHourlyUsageUserIds {
  user_ids: (number | null)[];
}

export interface IHourlyUsageItem {
  hour: string; // "00:00"
  unique_users: number;
  total_requests: number;
  user_ids: (number | null)[];
}

export interface IGetHourlyUsageResponse {
  data: {
    date: string; // "2026-06-07"
    hours: IHourlyUsageItem[];
  };
}

export interface IHeatmapItem {
  day_of_week: number;
  hour_of_day: number;
  avg_users: string;
}

export interface IGetHeatmapResponse {
  data: {
    heatmap: IHeatmapItem[];
  };
}

export interface IPeakHourItem {
  hour_of_day: number;
  avg_users: string;
  max_users: number;
}

export interface IGetPeakHoursResponse {
  data: {
    days: number;
    peak_hours: IPeakHourItem[];
  };
}
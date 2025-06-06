export interface Stop {
    id: number;
    address_name: string;
    lat: number;
    long: number;
  }
  
  export interface Route {
    id: number;
    region_id: string;
    transport_company_name: string;
    title: string;
    is_school_run: boolean;
    locations: string;
    is_active: boolean;
  }
  
  export interface Service {
    id: number;
    route_id: number;
    code: string;
    is_active: boolean;
  }
  
  export interface Trip {
    id: number;
    service_id: number;
    service_version: number;
    start_time: string;
  }
  
  export interface TripDay {
    trip_id: number;
    day: string;
  }
  
  export interface Stop {
    id: number;
    address_name: string;
    lat: number;
    long: number;
  }
  
  export interface BusSchedule {
    id: string;
    routeTitle: string;
    departureTime: string;
    // Add other properties if necessary
  }
  
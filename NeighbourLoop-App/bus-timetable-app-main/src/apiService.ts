import axiosInstance from './axiosInstance';
import { Stop, BusSchedule } from './types'; // Adjust the import path as necessary

export const getStops = async (): Promise<Stop[]> => {
  try {
    const response = await axiosInstance.get('/stops');
    return response.data;
  } catch (error) {
    console.error('Error fetching stops:', error);
    throw error;
  }
};

export const getBusSchedules = async (): Promise<BusSchedule[]> => {
  try {
    const response = await axiosInstance.get('/bus-schedules');
    return response.data;
  } catch (error) {
    console.error('Error fetching bus schedules:', error);
    throw error;
  }
};

// Add more API calls as needed

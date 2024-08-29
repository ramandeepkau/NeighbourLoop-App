// src/apiService.ts
import axiosInstance from './axiosInstance';


export const getStops = async (): Promise<Stop[]> => {
  try {
    const response = await axiosInstance.get('/region_data_app');
    return response.data;
  } catch (error) {
    console.error('Error fetching stops:', error);
    throw error;
  }
};

interface RegionData {
  id: string;
  region_name: string;
}


export const getRegions = async (): Promise<RegionData[]> => {
  try {
    const response = await axiosInstance.get('/region_data_app');
    console.log('Fetched regions:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching regions:', error);
    throw error;
  }
};

// Add more API calls as needed

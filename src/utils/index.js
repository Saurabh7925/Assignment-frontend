import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000', 
});

export const saveItem = async (item) => {
    try {
      const response = await api.post('/save-item', item);
      return response.data;
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  };
  

  export const getItems = async (title = '', dateRange = [], page = 1) => {
    try {
      const startDate = dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : '';
      const endDate = dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : '';
  
      const query = new URLSearchParams({
        title,
        startDate,
        endDate,
        page,
      }).toString();
  
      const response = await fetch(`http://localhost:8000/get-items?${query}`);
  
      if (!response.ok) {
        const errorMessage = await response.text(); 
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }
  
      return response.json();
    } catch (error) {
      console.error('Error fetching items:', error);
      throw error;
    }
  };
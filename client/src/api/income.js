import api from './api';

export const addIncome = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-income/${userId}`, payload);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'An error occurred while adding income';
    throw new Error(message);
  }
};

export const getIncomes = async (userId) => {
  try {
    const { data } = await api.get(`/get-incomes/${userId}`);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'An error occurred while fetching incomes. Please try again.';
    throw new Error(message);
  }
}; 
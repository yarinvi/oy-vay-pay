import api from './api'

export const addExpense = async (payload) => {
    try {
        const {userId} = payload;
        const { data } = await api.post(`/add-expense/${userId}`, payload);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while adding expense';
        throw new Error(message);
    }
}
export const getExpenses = async (userId) => {
    try {
        const { data } = await api.get(`/get-expenses/${userId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while fetching expenses. Please try again.';
        throw new Error(message);
    }
}
export const getTotalExpenses = async (userId) => {
    try {
        const { data } = await api.get(`/get-total-expenses/${userId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while fetching total expenses. Please try again.';
        throw new Error(message);
    }
}
export const deleteExpense = async (userId, expenseId) => {
    try {
        const { data } = await api.delete(`/delete-expense/${userId}/${expenseId}`);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while deleting the expense';
        throw new Error(message);
    }
}
export const updateExpense = async (userId, expenseId, payload) => {
    try {
        const { data } = await api.patch(`/update-expense/${userId}/${expenseId}`, payload);
        return data;
    } catch (error) {
        const message = error.response?.data?.message || 'An error occurred while updating the expense';
        throw new Error(message);
    }
}

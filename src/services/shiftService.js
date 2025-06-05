import axios from 'axios';

const API_URL = 'http://localhost:8000/';

export const getShifts = async (token) => {

    const response = await axios.get(`${API_URL}core/shifts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;

}

export const createShift = async (shiftData, token) => {
    const response = await axios.post(`${API_URL}core/shifts/create/`, shiftData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  };

export const editShift = async (id, shiftData, token) => {
    const response = await axios.patch(`${API_URL}core/shifts/${id}/edit/`, shiftData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const deleteShift = async (token, id) => {
    const response = await axios.delete(`${API_URL}core/shift/edit`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        data: { id },
    });
    return response.data;
};

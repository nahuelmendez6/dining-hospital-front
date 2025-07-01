import axios from "axios";

const API_URL = "http://localhost:8000/core/";

export const getMenuItems = async () => {
    const res = await axios.get(`${API_URL}menu-items/`)
    return res.data;
};


export const createMenuItem = async (data, token) => {
    return await axios.post(`${API_URL}menu-items/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
};

export const updateMenuItem = async (id, data, token) => {
    return await axios.patch(`${API_URL}edit/menu-item/${id}/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
};


export const deleteMenuItem = async (id, token) => {
    const res = await axios.delete(`${API_URL}menu-items/${id}/`, {
        headers: {
            Authorization: `Bearer ${token}`,
          },
    });
    return res;
};

export const getShifts = async (token) => {
    const res = await axios.get(`${API_URL}shifts/`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
    });
    return res.data;
};

export const updateShiftMenuItems = async (shiftId, itemIds, token) => {
    const res = await axios.patch(
      `${API_URL}shifts/${shiftId}/edit/`,
      { menu_items: itemIds },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
};

export const toggleShiftMenuActive = async (shiftId, currentValue, token) => {
    const res = await axios.patch(
      `${API_URL}shifts/${shiftId}/edit/`,
      { menu_active: !currentValue },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
};
  
  
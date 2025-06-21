// services/groupService.js
import axios from 'axios';

export const getGroups = async (token) => {
  const response = await axios.get('http://localhost:8000/auth/get-groups/', {
    headers: {
        Authorization: `Bearer ${token}`,

    },
  });
  return response.data;
};

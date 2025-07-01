import { useState, useEffect } from 'react'
import { getShifts, createShift, editShift, deleteShift } from '../services/shiftService'
import { toast } from "react-toastify";
import {
  updateShiftMenuItems,
  toggleShiftMenuActive,
} from "../services/menuService";


const useShifts = (token) =>{
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchShifts = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await getShifts(token);
            setShifts(data);
            setError(null);
        } catch {
            setError('Error al cargar turnos.');
        } finally {
            setLoading(false);
        }
    };

    const updateItems = async (shiftId, itemIds) => {
      try {
        await updateShiftMenuItems(shiftId, itemIds, token);
        toast.success("Menú actualizado");
        await fetchShifts();
      } catch (error) {
        toast.error("Error al asignar ítems");
      }
    };

    const toggleActive = async (shiftId, currentValue) => {
      try {
        await toggleShiftMenuActive(shiftId, currentValue, token);
        await fetchShifts();
      } catch (error) {
        toast.error("Error al cambiar el estado del menú");
      }
    };
  

    useEffect(() => {
        fetchShifts();
      }, [token]);
    
      const saveShift = async (id, form) => {
        try {
          id ? await editShift(id, form, token) : await createShift(form, token);
          await fetchShifts();
          return true;
        } catch {
          setError('Error al guardar turno.');
          return false;
        }
      };
    
      const removeShift = async (id) => {
        try {
          await deleteShift(id, token);
          await fetchShifts();
          return true;
        } catch {
          setError('Error al eliminar turno.');
          return false;
        }
      };
    
      return { 
        shifts, 
        loading, 
        error, 
        saveShift, 
        removeShift,
        updateItems,
        toggleActive, 
      };
};

export default useShifts;
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ShiftFormModal({ shift, onClose }) {
  const [name, setName] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  useEffect(() => {
    if (shift) {
      setName(shift.name);
      setStart(shift.start_time);
      setEnd(shift.end_time);
    }
  }, [shift]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (shift) {
        // Editar
        await axios.put('http://localhost:8000/core/shift/edit', {
          id: shift.id,
          name,
          start_time: start,
          end_time: end,
        });
      } else {
        // Crear
        await axios.post('http://localhost:8000/core/shift/new', {
          name,
          start_time: start,
          end_time: end,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error al guardar el turno:', error);
    }
  };

  return (
    <div className="modal">
      <h3>{shift ? 'Editar turno' : 'Crear nuevo turno'}</h3>
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Inicio</label>
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />

        <label>Fin</label>
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />

        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}
